# 📧 Email Classifier Service

This service fetches emails from an IMAP server, processes them for classification, detects spam & duplicates, extracts text from attachments using OCR, and routes them to the appropriate department using an AI model.

---

## 🚀 Features
- **Fetch Emails**: Retrieves unread emails from an IMAP email server (Gmail, Outlook, etc.).
- **Attachment Handling**: Extracts text from PDFs, TXT, DOCX, CSV, and EML files.
- **Spam & Duplicate Detection**: Identifies and filters out spam or duplicate emails.
- **AI-Powered Classification**: Uses an open-source LLM (Gemma 2B) to categorize emails.
- **Routing**: Assigns emails to appropriate banking departments (e.g., Fraud, Loans, Support).
- **Database Storage**: Stores classified emails in PostgreSQL/Firebase for reporting.
- **Async Email Fetching**: Improves performance using asynchronous processing.

---

## 🏗 Project Structure
```
📂 email-classifier-service/
├── 📄 main.py             # FastAPI entry point
├── 📂 config/
│   ├── 📄 settings.py     # Email credentials & configs
├── 📂 services/
│   ├── 📄 email_service.py # Fetch & process emails
│   ├── 📄 classification.py # AI-based email classification
│   ├── 📄 ocr_service.py   # Extract text from attachments
│   ├── 📄 database.py      # Handles email storage in PostgreSQL/Firebase
├── 📂 models/
│   ├── 📄 schemas.py       # Data models & validation
└── 📄 requirements.txt     # Python dependencies
```

---

## 🛠 Installation & Setup
### 1️⃣ Clone the Repository
```sh
git clone https://github.com/yourusername/email-classifier-service.git
cd email-classifier-service
```

### 2️⃣ Create a Virtual Environment
```sh
python3 -m venv .venv
source .venv/bin/activate  # For macOS/Linux
.venv\Scripts\activate     # For Windows
```

### 3️⃣ Install Dependencies
```sh
pip install -r requirements.txt
```

### 4️⃣ Set Up Environment Variables
Create a `.env` file in the `config/` directory and add:
```
EMAIL_HOST=imap.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
DATABASE_URL=postgresql://user:password@localhost/email_db
```

---

## 🏃‍♂️ Running the Service
### 1️⃣ Pull and Run the AI Model (Gemma 2B)
```sh
ollama pull gemma:2b
ollama run gemma:2b
```

### 2️⃣ Start the FastAPI Server
```sh
uvicorn main:app --reload
```

### 3️⃣ Available API Endpoints
| Method | Endpoint              | Description |
|--------|-----------------------|-------------|
| `GET`  | `/`                   | Health check |
| `GET`  | `/classify-emails`     | Fetch & classify new emails |
| `GET`  | `/recheck-emails`      | Reclassify the most recent email |


