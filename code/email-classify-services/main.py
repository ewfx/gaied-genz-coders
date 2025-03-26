import email
import threading
import time
import logging
from datetime import datetime
from email.header import decode_header  # ✅ FIXED: Correct import

from fastapi import FastAPI
from services.email_service import fetch_unread_emails, connect_to_email, extract_email_body, extract_attachments
from services.classification import classify_email
from typing import List

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "✅ Email Classifier API is running!"}

@app.get("/classify-emails")
def classify_emails():
    """Fetch unread emails and classify them using Gemma 2B."""
    emails = fetch_unread_emails()

    if not emails:
        return {"message": "No new emails to classify."}

    classified_emails = []
    for email_data in emails:
        classification_result = classify_email(email_data["body"])
        routed_department = classification_result.get("routed_to", "General Support")  # Ensure a valid key

        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        logger.info(f"📩 [NEW EMAIL] Received at {timestamp}")
        logger.info(f"   From: {email_data['from']}")
        logger.info(f"   Subject: {email_data['subject']}")
        logger.info(f"   Routed To: {routed_department}")

        classified_emails.append({
            "from": email_data["from"],
            "subject": email_data["subject"],
            "routed_to": routed_department
        })

    return {"emails": classified_emails}

@app.get("/recheck-emails")
def recheck_emails():
    """Reclassifies the last fetched unread email. If no unread emails, fetch the most recent email."""
    mail = connect_to_email()
    if not mail:
        return {"message": "Error connecting to email."}

    try:
        # Try fetching UNSEEN (unread) emails first
        status, messages = mail.search(None, 'UNSEEN')
        email_ids = messages[0].split()

        # If no unread emails, fetch the latest email (SEEN or UNSEEN)
        if not email_ids:
            status, messages = mail.search(None, 'ALL')  # Fetch all emails
            email_ids = messages[0].split()
            if not email_ids:
                return {"message": "No emails found in the inbox."}

        # Get the latest email ID
        latest_email_id = email_ids[-1]
        _, msg_data = mail.fetch(latest_email_id, "(RFC822)")

        for response_part in msg_data:
            if isinstance(response_part, tuple):
                msg = email.message_from_bytes(response_part[1])

                sender = msg.get("From")
                subject, encoding = decode_header(msg["Subject"])[0]
                subject = subject.decode(encoding) if isinstance(subject, bytes) else subject
                body = extract_email_body(msg) or ""  # ✅ Ensure it's a string
                attachment_text = extract_attachments(msg) or ""  # ✅ Ensure it's a string

                # Classify the email
                classification_result = classify_email(body + "\n" + attachment_text)
                routed_department = classification_result.get("routed_to", "General Support")

                logger.info(f"🔄 Rechecking Email")
                logger.info(f"   From: {sender}")
                logger.info(f"   Subject: {subject}")
                logger.info(f"   Routed To: {routed_department}")

                return {
                    "from": sender,
                    "subject": subject,
                    "routed_to": routed_department
                }

        return {"message": "Failed to process email."}

    except Exception as e:
        return {"error": f"Failed to recheck email: {str(e)}"}

    finally:
        mail.logout()

# Background email monitoring
def background_email_monitor():
    while True:
        logger.info(f"🔄 Checking for new emails at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        fetch_unread_emails()
        time.sleep(30)  # Poll for new emails every 30 seconds

email_thread = threading.Thread(target=background_email_monitor, daemon=True)
email_thread.start()