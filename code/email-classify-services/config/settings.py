import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

EMAIL_HOST = os.getenv("EMAIL_HOST", "imap.gmail.com")  # IMAP server for Gmail
EMAIL_USER = os.getenv("EMAIL_USER", "rydermac50@gmail.com")
EMAIL_PASS = os.getenv("EMAIL_PASS", "xdqv symg ibjd cazw")