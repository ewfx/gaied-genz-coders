import os
import fitz  # PyMuPDF for PDFs
import docx
import extract_msg  # For EML files
import pytesseract  # OCR for scanned PDFs & images
import csv
from PIL import Image


def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract text from a PDF file. Uses OCR if needed."""
    text = ""
    with fitz.open(pdf_path) as doc:
        for page in doc:
            text += page.get_text("text")

    # If no text found, try OCR
    if not text.strip():
        text = perform_ocr_on_image(pdf_path)

    print(f"\n📄 Extracted Text from PDF ({pdf_path}):\n{text}")
    return text


def extract_text_from_docx(docx_path: str) -> str:
    """Extract text from a DOCX file."""
    doc = docx.Document(docx_path)
    text = "\n".join([para.text for para in doc.paragraphs])
    print(f"\n📄 Extracted Text from DOCX ({docx_path}):\n{text}")
    return text


def extract_text_from_txt(txt_path: str) -> str:
    """Extract text from a TXT file."""
    with open(txt_path, "r", encoding="utf-8") as file:
        text = file.read()
    print(f"\n📄 Extracted Text from TXT ({txt_path}):\n{text}")
    return text


def extract_text_from_eml(eml_path: str) -> str:
    """Extract text from an EML file."""
    msg = extract_msg.Message(eml_path)
    text = msg.body or ""
    print(f"\n📧 Extracted Text from EML ({eml_path}):\n{text}")
    return text


def extract_text_from_csv(csv_path: str) -> str:
    """Extract text from a CSV file."""
    with open(csv_path, "r", encoding="utf-8") as file:
        reader = csv.reader(file)
        text = "\n".join([" | ".join(row) for row in reader])
    print(f"\n📊 Extracted Text from CSV ({csv_path}):\n{text}")
    return text


def perform_ocr_on_image(image_path: str) -> str:
    """Perform OCR on images (PNG, JPG, BMP, TIFF, Scanned PDFs)."""
    img = Image.open(image_path)
    text = pytesseract.image_to_string(img)
    print(f"\n🖼 Extracted Text from Image ({image_path}):\n{text}")
    return text


def extract_text_from_file(file_path: str) -> str:
    """Detect file type and extract text accordingly."""
    ext = file_path.lower().split(".")[-1]

    if ext in ["pdf"]:
        return extract_text_from_pdf(file_path)
    elif ext in ["docx", "doc"]:
        return extract_text_from_docx(file_path)
    elif ext in ["txt"]:
        return extract_text_from_txt(file_path)
    elif ext in ["eml"]:
        return extract_text_from_eml(file_path)
    elif ext in ["csv"]:
        return extract_text_from_csv(file_path)
    elif ext in ["png", "jpg", "jpeg", "tiff", "bmp"]:
        return perform_ocr_on_image(file_path)
    else:
        print(f"\n⚠️ Unsupported file type: {file_path}")
        return "Unsupported file type"