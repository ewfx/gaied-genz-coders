import ollama

# Enhanced Department Mapping with Multiple Keywords & Conditions
BANK_DEPARTMENTS = {
    "fraud": {
        "name": "Fraud Investigation",
        "keywords": ["fraud", "unauthorized", "scam", "hacked", "compromised", "identity theft", "stolen", "phishing",
                     "charge dispute", "fraudulent", "blocked", "account lock", "security breach", "card fraud",
                     "credit card scam", "fake transaction", "unauthorized login", "money stolen", "wire fraud",
                     "suspicious activity"],
        "priority": 1
    },
    "dispute": {
        "name": "Dispute Resolution",
        "keywords": ["dispute", "chargeback", "unauthorized transaction", "merchant issue", "refund request",
                     "billing error", "overcharged", "transaction dispute", "disputed charge", "claim",
                     "payment reversal", "settlement", "investigation", "funds withheld", "service not received",
                     "goods not delivered", "refund delay", "payment fraud", "financial dispute", "charge inquiry"],
        "priority": 2
    },
    "loan": {
        "name": "Loan Services",
        "keywords": ["loan", "personal loan", "auto loan", "home equity", "borrow", "lending", "debt", "interest rate",
                     "loan application", "loan approval", "EMI", "prepayment", "mortgage", "credit eligibility",
                     "financing", "loan modification", "deferred payment", "debt relief", "consolidation loan",
                     "loan settlement"],
        "priority": 3
    },
    "wealth": {
        "name": "Wealth Management",
        "keywords": ["investment", "portfolio", "trading", "stocks", "wealth", "hedge fund", "dividends",
                     "mutual funds", "bonds", "capital gains", "estate planning", "risk management",
                     "financial planning", "trust fund", "private banking", "high net worth", "managed accounts",
                     "retirement investments", "alternative assets", "financial growth"],
        "priority": 4
    },
    "compliance": {
        "name": "Regulatory Compliance",
        "keywords": ["KYC", "AML", "regulatory", "compliance", "legal", "audit", "tax compliance",
                     "identity verification", "anti-money laundering", "reporting", "bank policy", "risk management",
                     "government request", "subpoena", "law enforcement", "fraud monitoring", "federal regulations",
                     "bank secrecy act", "customer due diligence", "risk assessment"],
        "priority": 5
    },
    "general": {
        "name": "General Customer Service",
        "keywords": ["help", "support", "assistance", "question", "query", "customer care", "customer representative",
                     "agent", "call center", "service issue", "bank branch", "information request", "contact",
                     "account inquiry", "status update", "update information", "banking hours", "transaction details",
                     "general inquiry", "customer experience"],
        "priority": 10
    }
}


def match_department_by_keywords(email_body: str) -> str:
    """Matches email content to the most relevant department based on keywords."""
    email_lower = email_body.lower()
    best_match = "General Customer Service"
    highest_priority = float("inf")

    for dept_key, dept_info in BANK_DEPARTMENTS.items():
        if any(keyword in email_lower for keyword in dept_info["keywords"]):
            if dept_info["priority"] < highest_priority:
                best_match = dept_info["name"]
                highest_priority = dept_info["priority"]

    return best_match


def classify_email(email_body: str) -> dict:
    """Multi-level verification for routing banking emails."""
    prompt = f"""
    ### Banking Email Classification Task
    You are an AI banking assistant responsible for routing customer inquiries. 
    - Analyze the email content.
    - Select the **most appropriate department** from the list below.
    - If unsure, return: "General Customer Service".

    **Departments:** {", ".join([dept["name"] for dept in BANK_DEPARTMENTS.values()])}

    **Customer Message:**
    "{email_body}"

    **Response Format:**
    - Respond ONLY with the department name.
    """

    try:
        response = ollama.chat(
            model="gemma:2b",
            messages=[{"role": "user", "content": prompt}],
            options={"temperature": 0.1}
        )

        department = response["message"]["content"].strip()

        # Validate LLM output and use keyword matching as a fallback
        if department not in [dept["name"] for dept in BANK_DEPARTMENTS.values()]:
            department = match_department_by_keywords(email_body)

        return {"routed_to": department}

    except Exception as e:
        return {"routed_to": "General Customer Service", "error": str(e)}