import os
import unicodedata
from datetime import datetime
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    Image,
    KeepTogether,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

# ---------------------------------------------------------------- palette
INDIGO = colors.HexColor("#4F46E5")
INDIGO_DARK = colors.HexColor("#312E81")
INDIGO_SOFT = colors.HexColor("#EEF2FF")
SLATE_900 = colors.HexColor("#0F172A")
SLATE_700 = colors.HexColor("#334155")
SLATE_500 = colors.HexColor("#64748B")
SLATE_200 = colors.HexColor("#E2E8F0")
SLATE_50 = colors.HexColor("#F8FAFC")
GREEN = colors.HexColor("#059669")
GREEN_SOFT = colors.HexColor("#ECFDF5")
AMBER = colors.HexColor("#D97706")
AMBER_SOFT = colors.HexColor("#FFFBEB")
RED = colors.HexColor("#DC2626")
RED_SOFT = colors.HexColor("#FEF2F2")

PAGE_W, PAGE_H = A4
MARGIN = 18 * mm
CONTENT_W = PAGE_W - 2 * MARGIN

# ---------------------------------------------------------------- text safety
# The built-in PDF fonts only cover Latin-1 / cp1252. LLM answers often contain
# characters outside it (non-breaking hyphen, arrows, etc.) which render as
# black squares, so everything is normalised before it reaches a Paragraph.
_REPLACEMENTS = {
    "\u2010": "-", "\u2011": "-", "\u2012": "-", "\u2212": "-",
    "\u2192": "->", "\u2190": "<-", "\u21d2": "=>",
    "\u2009": " ", "\u200a": " ", "\u2002": " ", "\u2003": " ",
    "\u2007": " ", "\u2008": " ", "\u202f": " ", "\u2060": "",
    "\u200b": "", "\u200c": "", "\u200d": "", "\ufeff": "",
    "\u2713": "", "\u2714": "", "\u2605": "*", "\u2606": "*",
}


def clean_text(value) -> str:
    if value is None:
        return ""
    text = str(value)
    out = []
    for ch in text:
        if ch in _REPLACEMENTS:
            out.append(_REPLACEMENTS[ch])
            continue
        if ch in "\n\t":
            out.append(ch)
            continue
        try:
            ch.encode("cp1252")
            out.append(ch)
        except UnicodeEncodeError:
            folded = unicodedata.normalize("NFKD", ch).encode("cp1252", "ignore").decode("cp1252")
            out.append(folded)  # drops anything that still cannot be drawn
    return "".join(out).strip()


def safe(value, default="") -> str:
    """Clean + XML-escape, ready for a reportlab Paragraph."""
    text = clean_text(value)
    return escape(text) if text else default


def fmt_num(value, suffix="") -> str:
    try:
        number = float(value)
    except (TypeError, ValueError):
        return "-"
    text = str(int(number)) if number == int(number) else f"{number:.1f}"
    return f"{text}{suffix}"


def to_float(value, default=0.0) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def score_color(value: float):
    if value >= 70:
        return GREEN
    if value >= 45:
        return AMBER
    return RED


# ---------------------------------------------------------------- styles
def _styles():
    base = dict(fontName="Helvetica", textColor=SLATE_700, leading=14, fontSize=9.5)
    return {
        "brand": ParagraphStyle("brand", fontName="Helvetica-Bold", fontSize=10, textColor=colors.HexColor("#C7D2FE"), leading=12),
        "title": ParagraphStyle("title", fontName="Helvetica-Bold", fontSize=22, textColor=colors.white, leading=26),
        "meta": ParagraphStyle("meta", fontName="Helvetica", fontSize=9, textColor=colors.HexColor("#C7D2FE"), leading=12),
        "h2": ParagraphStyle("h2", fontName="Helvetica-Bold", fontSize=13, textColor=SLATE_900, leading=16, spaceBefore=6, spaceAfter=6),
        "label": ParagraphStyle("label", fontName="Helvetica", fontSize=8.5, textColor=SLATE_500, leading=11),
        "value": ParagraphStyle("value", fontName="Helvetica-Bold", fontSize=10, textColor=SLATE_900, leading=13),
        "body": ParagraphStyle("body", **base),
        "stat_value": ParagraphStyle("stat_value", fontName="Helvetica-Bold", fontSize=20, leading=24, alignment=TA_CENTER),
        "stat_label": ParagraphStyle("stat_label", fontName="Helvetica", fontSize=8, textColor=SLATE_500, leading=10, alignment=TA_CENTER),
        "col_head": ParagraphStyle("col_head", fontName="Helvetica-Bold", fontSize=9.5, textColor=colors.white, leading=12),
        "chip_text": ParagraphStyle("chip_text", fontName="Helvetica", fontSize=9, textColor=SLATE_700, leading=13),
        "num": ParagraphStyle("num", fontName="Helvetica-Bold", fontSize=10, textColor=INDIGO, leading=14, alignment=TA_CENTER),
        "verdict": ParagraphStyle("verdict", fontName="Helvetica-Bold", fontSize=14, leading=18),
    }


# ---------------------------------------------------------------- blocks
def _header(st, role, generated):
    inner = [
        [Paragraph("INTERVIEWIQ AI", st["brand"])],
        [Paragraph("Interview Assessment Report", st["title"])],
        [Paragraph(f"{safe(role, 'Interview')} &nbsp;|&nbsp; Generated on {generated}", st["meta"])],
    ]
    table = Table(inner, colWidths=[CONTENT_W])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), INDIGO_DARK),
        ("LEFTPADDING", (0, 0), (-1, -1), 16),
        ("RIGHTPADDING", (0, 0), (-1, -1), 16),
        ("TOPPADDING", (0, 0), (0, 0), 16),
        ("BOTTOMPADDING", (0, -1), (-1, -1), 16),
        ("TOPPADDING", (0, 1), (-1, -1), 2),
        ("BOTTOMPADDING", (0, 0), (-1, -2), 2),
        ("LINEBELOW", (0, -1), (-1, -1), 3, INDIGO),
    ]))
    return table


def _info_block(st, candidate, interview):
    def cell(label, value):
        return [Paragraph(label, st["label"]), Paragraph(safe(value, "-"), st["value"])]

    rows = [
        [cell("Candidate", candidate.get("name")), cell("Role", interview.get("role"))],
        [cell("Email", candidate.get("email")), cell("Difficulty", interview.get("difficulty"))],
        [cell("Status", interview.get("status")), cell("Report date", datetime.now().strftime("%d %b %Y"))],
    ]
    half = CONTENT_W / 2
    table = Table(rows, colWidths=[half, half])
    table.setStyle(TableStyle([
        ("BOX", (0, 0), (-1, -1), 0.75, SLATE_200),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, SLATE_200),
        ("BACKGROUND", (0, 0), (-1, -1), SLATE_50),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))
    return table


def _stat_cards(st, items):
    gap = 6
    width = (CONTENT_W - gap * (len(items) - 1)) / len(items)
    cells, col_widths = [], []
    for index, (label, value, color) in enumerate(items):
        value_style = ParagraphStyle(f"sv{index}", parent=st["stat_value"], textColor=color)
        cells.append([Paragraph(value, value_style), Paragraph(label, st["stat_label"])])
        col_widths.append(width)
        if index < len(items) - 1:
            cells.append("")
            col_widths.append(gap)

    # build a single-row table; each stat is a nested 2-row table
    row = []
    for cell in cells:
        if cell == "":
            row.append("")
        else:
            inner = Table([[cell[0]], [cell[1]]], colWidths=[width])
            inner.setStyle(TableStyle([
                ("BOX", (0, 0), (-1, -1), 0.75, SLATE_200),
                ("BACKGROUND", (0, 0), (-1, -1), colors.white),
                ("TOPPADDING", (0, 0), (-1, 0), 10),
                ("BOTTOMPADDING", (0, 0), (-1, 0), 0),
                ("TOPPADDING", (0, 1), (-1, 1), 2),
                ("BOTTOMPADDING", (0, 1), (-1, 1), 10),
            ]))
            row.append(inner)
    table = Table([row], colWidths=col_widths)
    table.setStyle(TableStyle([
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    return table


def _skills_block(st, skills):
    def column(title, items):
        names = [safe(item) for item in (items or []) if clean_text(item)]
        body = ", ".join(names) if names else "None identified"
        return Paragraph(title, st["col_head"]), Paragraph(body, st["chip_text"])

    cols = [
        (column("Strong", skills.get("strong")), GREEN, GREEN_SOFT),
        (column("Medium", skills.get("medium")), AMBER, AMBER_SOFT),
        (column("Weak", skills.get("weak")), RED, RED_SOFT),
    ]
    gap = 6
    width = (CONTENT_W - gap * 2) / 3
    head_row, body_row, widths, style = [], [], [], []
    for index, ((head, text), head_color, soft_color) in enumerate(cols):
        c = index * 2  # column index in the table (gap columns sit in between)
        head_row.append(head)
        body_row.append(text)
        widths.append(width)
        style += [
            ("BACKGROUND", (c, 0), (c, 0), head_color),
            ("BACKGROUND", (c, 1), (c, 1), soft_color),
            ("LEFTPADDING", (c, 0), (c, 1), 10),
            ("RIGHTPADDING", (c, 0), (c, 1), 10),
        ]
        if index < 2:
            head_row.append("")
            body_row.append("")
            widths.append(gap)
    table = Table([head_row, body_row], colWidths=widths)
    table.setStyle(TableStyle(style + [
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    return table


def _callout(st, text, accent):
    table = Table([[Paragraph(text, st["body"])]], colWidths=[CONTENT_W])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), SLATE_50),
        ("LINEBEFORE", (0, 0), (0, -1), 3, accent),
        ("LEFTPADDING", (0, 0), (-1, -1), 14),
        ("RIGHTPADDING", (0, 0), (-1, -1), 14),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
    ]))
    return table


def _verdict(st, recommendation):
    label = clean_text(recommendation) or "N/A"
    lowered = label.lower()
    if "not" in lowered or "reject" in lowered or "no hire" in lowered:
        fg, bg = RED, RED_SOFT
    elif "recommend" in lowered or "hire" in lowered:
        fg, bg = GREEN, GREEN_SOFT
    else:
        fg, bg = AMBER, AMBER_SOFT
    style = ParagraphStyle("verdict_dyn", parent=st["verdict"], textColor=fg)
    table = Table(
        [[Paragraph("Hiring recommendation", st["label"]), Paragraph(escape(label), style)]],
        colWidths=[CONTENT_W * 0.4, CONTENT_W * 0.6],
    )
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), bg),
        ("BOX", (0, 0), (-1, -1), 0.75, fg),
        ("LEFTPADDING", (0, 0), (-1, -1), 14),
        ("TOPPADDING", (0, 0), (-1, -1), 12),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))
    return table


def _feedback_items(st, feedback):
    if isinstance(feedback, (list, tuple)):
        lines = [clean_text(item) for item in feedback]
    else:
        lines = [clean_text(line) for line in str(feedback or "").split("\n")]
    lines = [line for line in lines if line]

    blocks = []
    for index, line in enumerate(lines, start=1):
        row = Table(
            [[Paragraph(str(index), st["num"]), Paragraph(escape(line), st["body"])]],
            colWidths=[26, CONTENT_W - 26],
        )
        row.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (0, 0), INDIGO_SOFT),
            ("BACKGROUND", (1, 0), (1, 0), SLATE_50),
            ("BOX", (0, 0), (-1, -1), 0.5, SLATE_200),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("TOPPADDING", (0, 0), (-1, -1), 8),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ("LEFTPADDING", (1, 0), (1, 0), 10),
            ("RIGHTPADDING", (1, 0), (1, 0), 10),
        ]))
        blocks.append(row)
        blocks.append(Spacer(1, 5))
    return blocks


def _footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(SLATE_200)
    canvas.line(MARGIN, 14 * mm, PAGE_W - MARGIN, 14 * mm)
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(SLATE_500)
    canvas.drawString(MARGIN, 9 * mm, "Generated by InterviewIQ AI")
    canvas.drawRightString(PAGE_W - MARGIN, 9 * mm, f"Page {doc.page}")
    canvas.restoreState()


# ---------------------------------------------------------------- public API
def generate_interview_report_pdf(file_path: str, data: dict):
    st = _styles()

    candidate = data.get("candidate") or {}
    interview = data.get("interview") or {}
    stats = data.get("statistics") or {}
    integrity = data.get("integrity") or {}
    skills = data.get("skills") or {}

    overall = to_float(stats.get("overall_score"))
    ats = to_float(data.get("ats_score"))
    integrity_score = to_float(integrity.get("integrity_score"), 100)
    average = to_float(stats.get("average_score"))

    doc = SimpleDocTemplate(
        file_path,
        pagesize=A4,
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        topMargin=MARGIN,
        bottomMargin=20 * mm,
        title="InterviewIQ AI - Interview Assessment Report",
        author="InterviewIQ AI",
    )

    story = [
        _header(st, interview.get("role"), datetime.now().strftime("%d %b %Y")),
        Spacer(1, 12),
        _info_block(st, candidate, interview),
        Spacer(1, 12),
        _stat_cards(st, [
            ("Overall score", fmt_num(overall, "%"), score_color(overall)),
            ("Average score", f"{fmt_num(average)}<font size='10' color='#64748B'>/10</font>", score_color(average * 10)),
            ("Resume match (ATS)", fmt_num(ats, "%"), score_color(ats)),
            ("Integrity", fmt_num(integrity_score, "%"), score_color(integrity_score)),
        ]),
        Spacer(1, 14),
    ]

    chart = data.get("chart_path")
    if chart and os.path.exists(chart):
        story.append(Image(chart, width=420, height=220, hAlign="CENTER"))
        story.append(Spacer(1, 12))

    story.append(KeepTogether([Paragraph("Skill analysis", st["h2"]), _skills_block(st, skills)]))
    story.append(Spacer(1, 14))

    summary = safe(data.get("executive_summary"), "N/A").replace("\n", "<br/>")
    story.append(KeepTogether([Paragraph("Executive summary", st["h2"]), _callout(st, summary, INDIGO)]))
    story.append(Spacer(1, 14))

    story.append(_verdict(st, data.get("recommendation")))
    story.append(Spacer(1, 14))

    story.append(Paragraph("AI feedback", st["h2"]))
    items = _feedback_items(st, data.get("feedback"))
    if items:
        story.extend(items)
    else:
        story.append(Paragraph("No feedback available.", st["body"]))

    doc.build(story, onFirstPage=_footer, onLaterPages=_footer)
