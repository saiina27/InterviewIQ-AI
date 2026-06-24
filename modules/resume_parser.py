import pdfplumber
import re

def extract_resume_text(pdf_file):
    try:
        text = ""

        with pdfplumber.open(pdf_file) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()

                if page_text:
                    text += page_text + "\n"

        # Remove extra spaces and blank lines
        text = re.sub(r"\n+", "\n", text)
        text = text.strip()

        return text

    except Exception as e:
        print(f"Resume Parsing Error: {e}")
        return ""