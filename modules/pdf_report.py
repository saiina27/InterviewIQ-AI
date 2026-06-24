import os
from fpdf import FPDF

def generate_report(answers, score, recommendation):

    base_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.abspath(
        os.path.join(base_dir, "..")
    )

    reports_dir = os.path.join(
        project_root,
        "reports"
    )

    os.makedirs(
        reports_dir,
        exist_ok=True
    )

    file_path = os.path.join(
        reports_dir,
        "interview_report.pdf"
    )

    pdf = FPDF()

    pdf.add_page()

    pdf.set_font(
        "Arial",
        size=12
    )

    pdf.cell(
        200,
        10,
        "InterviewIQ AI Report",
        ln=True
    )

    pdf.cell(
        200,
        10,
        f"Overall Score: {score}%",
        ln=True
    )

    pdf.cell(
        200,
        10,
        f"Recommendation: {recommendation}",
        ln=True
    )

    pdf.ln(10)

    for item in answers:

        pdf.multi_cell(
            0,
            10,
            f"Q: {item['question']}"
        )

        pdf.multi_cell(
            0,
            10,
            f"A: {item['answer']}"
        )

        pdf.ln(5)

    pdf.output(file_path)

    return file_path