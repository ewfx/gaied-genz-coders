from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

# Load database URL from environment variable or use a default one
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/email_classifier")

# Create the database engine
engine = create_engine(DATABASE_URL, echo=True)

# Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for ORM models
Base = declarative_base()

# Define the Email model
class Email(Base):
    __tablename__ = "emails"

    id = Column(Integer, primary_key=True, index=True)
    sender = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    body = Column(Text, nullable=False)
    attachments_text = Column(Text, nullable=True)
    routed_to = Column(String, nullable=False)
    is_duplicate = Column(Boolean, default=False)
    is_spam = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

# Function to initialize the database
def init_db():
    Base.metadata.create_all(bind=engine)

# Dependency function to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
