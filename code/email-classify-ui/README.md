# 📧 Email Classifier UI

This is the frontend for the **AI-based Email Classification System**, built with **React + TypeScript** and styled with **CSS**. It provides a dashboard for viewing and managing classified emails using a sleek and responsive interface.

## 🚀 Features
- 📬 **Fetch & Display Emails**: View classified emails from the FastAPI backend.
- 🏷 **Category-Based Routing**: Emails are sorted based on classification (e.g., Fraud, Loan, General Inquiry).
- 🔍 **Search & Filter**: Easily find specific emails using filters.
- 📊 **Real-Time Updates**: New emails appear dynamically.
- 🎨 **Responsive UI**: Works on desktop and mobile.

## 🏗 Project Structure
```
📂 email-classifier-ui/
├── 📄 package.json        # Dependencies & scripts
├── 📂 public/             # Static assets
├── 📂 src/
│   ├── 📂 assets/         # Images & icons
│   ├── 📂 components/     # UI components (EmailCard, Sidebar, etc.)
│   ├── 📂 pages/          # Main pages (Dashboard, EmailList)
│   ├── 📂 services/       # API calls to backend
│   ├── 📂 types/          # TypeScript interfaces
│   ├── 📂 styles/         # Global styles
│   ├── 📄 App.tsx         # Main app entry point
│   ├── 📄 index.tsx       # Renders app
│   ├── 📄 routes.tsx      # React Router setup
└── ...
```

## 🛠 Installation & Setup
### 1️⃣ Clone the repository
```sh
git clone https://github.com/your-repo/email-classifier-ui.git
cd email-classifier-ui
```

### 2️⃣ Install dependencies
```sh
npm install
```

### 3️⃣ Start the development server
```sh
npm run dev
```

The app will be available at **http://localhost:5173** (if using Vite) or **http://localhost:3000** (if using Create React App).

## 🔗 API Integration
The UI interacts with the backend via REST API. Make sure the FastAPI backend is running.

- **Fetch Classified Emails**:
  ```sh
  GET http://localhost:8000/classify-emails
  ```
- **Recheck Emails**:
  ```sh
  GET http://localhost:8000/recheck-emails
  ```