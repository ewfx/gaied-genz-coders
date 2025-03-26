import os
import imaplib
import email
import hashlib
import json
from email.header import decode_header
import time
from config.settings import EMAIL_HOST, EMAIL_USER, EMAIL_PASS
from services.ocr_service import extract_text_from_pdf, extract_text_from_txt  # TXT & PDF extraction

ATTACHMENTS_DIR = "uploads"
HASH_FILE = "processed_emails.json"
os.makedirs(ATTACHMENTS_DIR, exist_ok=True)

# Load previously processed email hashes
if os.path.exists(HASH_FILE):
    with open(HASH_FILE, "r") as f:
        processed_emails = set(json.load(f))
else:
    processed_emails = set()

# Spam keywords list
SPAM_KEYWORDS = [
    "win money", "free gift", "congratulations", "urgent action required",
    "claim your prize", "limited time offer", "you've been selected",
    "click here", "unsubscribe", "guaranteed income", "exclusive deal"
]


def connect_to_email():
    """Connect to the email server using IMAP."""
    try:
        mail = imaplib.IMAP4_SSL(EMAIL_HOST)
        mail.login(EMAIL_USER, EMAIL_PASS)
        mail.select("inbox")  # Select inbox
        return mail
    except Exception as e:
        print(f"❌ Error connecting to email: {e}")
        return None


def normalize_text(text):
    """Normalize text to improve duplicate detection."""
    return " ".join(text.lower().split())


def generate_email_hash(subject, sender, body):
    """Generate a unique hash for an email to detect duplicates."""
    email_content = f"{normalize_text(subject)}{normalize_text(sender)}{normalize_text(body)}"
    return hashlib.md5(email_content.encode()).hexdigest()


def is_spam(email_body):
    """Check if the email body contains spam-like keywords."""
    email_text = email_body.lower()
    spam_count = sum(1 for word in SPAM_KEYWORDS if word in email_text)
    return spam_count > 2  # Mark as spam if more than 2 spam words are found


def fetch_unread_emails():
    """Fetch unread emails along with extracted attachment text."""
    mail = connect_to_email()
    if not mail:
        return []

    try:
        status, messages = mail.search(None, 'UNSEEN')  # Fetch unread emails
        email_ids = messages[0].split()

        emails = []
        for e_id in email_ids:
            _, msg_data = mail.fetch(e_id, "(RFC822)")
            for response_part in msg_data:
                if isinstance(response_part, tuple):
                    msg = email.message_from_bytes(response_part[1])

                    subject, encoding = decode_header(msg["Subject"])[0]
                    subject = subject.decode(encoding) if isinstance(subject, bytes) and encoding else subject

                    sender = msg.get("From")
                    body = extract_email_body(msg)
                    attachment_text = extract_attachments(msg)  # Extract text from TXT & PDF
                    full_text = body + " " + attachment_text

                    # Generate hash & check for duplicates
                    email_hash = generate_email_hash(subject, sender, full_text)
                    is_duplicate = email_hash in processed_emails
                    is_spam_email = is_spam(full_text)

                    # Log duplicate email detection
                    if is_duplicate:
                        print(f"🔄 [DUPLICATE] Email from {sender} with subject '{subject}' was already processed.")
                    else:
                        print(f"✅ [NEW] Processing email from {sender} - Subject: {subject}")

                    # Save email hash if not duplicate
                    processed_emails.add(email_hash)

                    emails.append({
                        "subject": subject,
                        "from": sender,
                        "body": body,
                        "attachments_text": attachment_text,  # Include extracted text
                        "is_duplicate": is_duplicate,
                        "is_spam": is_spam_email
                    })

        # Persist processed email hashes
        with open(HASH_FILE, "w") as f:
            json.dump(list(processed_emails), f)

        return emails
    except Exception as e:
        print(f"❌ Error fetching emails: {e}")
        return []
    finally:
        mail.logout()


def extract_email_body(msg):
    """Extracts the plain text body from an email message."""
    if msg.is_multipart():
        for part in msg.walk():
            content_type = part.get_content_type()
            content_disposition = str(part.get("Content-Disposition"))

            if content_type == "text/plain" and "attachment" not in content_disposition:
                return part.get_payload(decode=True).decode("utf-8", errors="ignore")
    else:
        return msg.get_payload(decode=True).decode("utf-8", errors="ignore")
    return ""


def extract_attachments(msg):
    """Extracts text from email attachments (only TXT and PDF)."""
    extracted_text = ""

    for part in msg.walk():
        if part.get_content_disposition() == "attachment":
            filename = part.get_filename()
            if filename:
                file_path = os.path.join(ATTACHMENTS_DIR, filename)

                try:
                    with open(file_path, "wb") as f:
                        f.write(part.get_payload(decode=True))

                    print(f"✅ Saved attachment: {file_path}")

                    # Extract text based on file type (TXT and PDF only)
                    if filename.lower().endswith(".pdf"):
                        extracted_text += f"\n[Attachment: {filename} (PDF)]\n"
                        extracted_text += extract_text_from_pdf(file_path)
                    elif filename.lower().endswith(".txt"):
                        extracted_text += f"\n[Attachment: {filename} (TXT)]\n"
                        extracted_text += extract_text_from_txt(file_path)
                    else:
                        print(f"⚠️ Unsupported file type: {filename}")

                    print(f"📄 Extracted Text from {filename}:\n{extracted_text}")

                except Exception as e:
                    print(f"❌ Error processing {filename}: {str(e)}")

    return extracted_text


def monitor_emails(interval=30):
    """Continuously checks for new emails and processes attachments."""
    while True:
        new_emails = fetch_unread_emails()
        if new_emails:
            print(f"📧 {len(new_emails)} new emails received:")
            for email_data in new_emails:
                print(f"From: {email_data['from']}, Subject: {email_data['subject']}")
                print(f"Duplicate: {email_data['is_duplicate']}, Spam: {email_data['is_spam']}")
                print(f"Attachments Extracted: {email_data.get('attachments_text', 'No attachments')}")
        else:
            print("No new emails.")
        time.sleep(interval)  # Wait before checking again