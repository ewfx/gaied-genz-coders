# 🚀 Email Classify

# 📧 Email Classifier Backend (FastAPI)

## 📝 Introduction
The **Email Classifier Backend** is a FastAPI-based service that processes incoming emails, extracts their content and attachments, classifies them using an open-source LLM, and routes them to the appropriate department in a banking system.

## 🎥 Refer the PPT attached in the Repo
🚀 The backend service fetches emails, extracts text from attachments, performs classification using **Gemma 2B**, and provides results via API. Try it by running the API locally!

## 💡 Inspiration
Handling a high volume of customer service requests manually is inefficient. This project automates email classification, spam filtering, and routing, making customer support workflows more efficient.

## 🔍 What It Does
✅ Fetches unread emails from an IMAP server (Gmail, Outlook, etc.)
✅ Extracts email content and processes attachments (PDF, TXT, OCR-enabled)
✅ Detects spam & duplicate emails using hashing and keyword filtering
✅ Classifies emails using **Gemma 2B** (or other LLMs like Mistral, LLaMA)
✅ Routes emails to the correct banking department (Fraud, Loans, Disputes, etc.)
✅ Provides API endpoints for classification and email rechecking

## 🏗 How We Built It
- **FastAPI**: API framework for email processing & classification
- **IMAP + Email Processing**: Fetches unread emails & extracts text
- **OCR (Tesseract, PyMuPDF)**: Extracts text from PDF, TXT attachments
- **Ollama**: Runs LLMs (Gemma 2B, Mistral) for classification
- **PostgreSQL**: Stores processed emails & classifications
- **Docker**: Containerized deployment for scalability

## 🚧 Challenges We Faced
⚠ **LLM Accuracy**: Ensuring precise classification for banking-specific inquiries
⚠ **OCR Extraction Issues**: Handling scanned PDFs and images efficiently
⚠ **Duplicate Detection**: Implementing a hashing system for content deduplication
⚠ **Spam Filtering**: Preventing false positives in spam detection

## 🚀 How to Run
### 1️⃣ Clone the Repository
```sh
git clone https://github.com/your-repo/email-classifier-backend.git
cd email-classifier-backend
```
### 2️⃣ Install Dependencies
```sh
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```
### 3️⃣ Set Up Email Credentials
Update `config/settings.py` with your IMAP server details:
```python
EMAIL_HOST = "imap.gmail.com"
EMAIL_USER = "your-email@gmail.com"
EMAIL_PASS = "your-app-password"
```
### 4️⃣ Pull & Run the LLM Model
```sh
ollama pull gemma:2b
ollama run gemma:2b
```
### 5️⃣ Start the FastAPI Server
```sh
uvicorn main:app --reload
```
### 6️⃣ Test API Endpoints
- **Classify Emails**: `GET http://127.0.0.1:8000/classify-emails`
- **Recheck Emails**: `GET http://127.0.0.1:8000/recheck-emails`

## 🔧 Tech Stack
- **Backend**: FastAPI, Python, Uvicorn
- **AI Models**: Ollama (Gemma 2B, Mistral, LLaMA)
- **Database**: PostgreSQL (Planned)
- **OCR**: Tesseract, PyMuPDF
- **Containerization**: Docker

## 👥 Team
👨‍💻 Shruthi K
👩‍💻 Teja H V
👨‍💻 Puranjay Kumar
👨‍💻 Tushar Vaniya


## 🏗️ Tech Stack
🚀 Backend (FastAPI Service)
	•	Language: Python 3.12
	•	Framework: FastAPI
	•	Email Handling: IMAP (via imaplib)
	•	OCR (Optical Character Recognition): Tesseract, PyMuPDF (pymupdf)
	•	LLM (Large Language Model): Ollama (Gemma 2B, Llama3 8B, Qwen 4B)
	•	Database: PostgreSQL
	•	Duplicate & Spam Detection: Hashing (MD5), Keyword Matching
	•	Background Processing: Threading

🎨 Frontend (React UI)
	•	Language: TypeScript
	•	Framework: React.js
	•	State Management: React Hooks
	•	Routing: React Router
	•	UI Library: Material UI (MUI)
	•	API Calls: Axios
	•	CSS Framework: Styled Components


 Flow Diagram
 <img width="589" alt="Flow Diagram" src="https://github.com/user-attachments/assets/9fef0033-6edb-4825-b32c-2fe97a2234d9" />

