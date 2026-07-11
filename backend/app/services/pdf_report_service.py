from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
import os

def generate_interview_report_pdf(file_path:str,data:dict):
    doc=SimpleDocTemplate(file_path,pagesize=A4)
    styles=getSampleStyleSheet()
    story=[]
    story.append(Paragraph("<b>InterviewIQ AI - Interview Assessment Report</b>",styles["Title"]))
    story.append(Spacer(1,16))

    c=data.get("candidate",{})
    i=data.get("interview",{})
    s=data.get("statistics",{})
    integ=data.get("integrity",{})

    tbl=Table([
        ["Field","Value"],
        ["Name",c.get("name","")],
        ["Email",c.get("email","")],
        ["Role",i.get("role","")],
        ["Difficulty",i.get("difficulty","")],
        ["Status",i.get("status","")],
    ],colWidths=[120,330])
    tbl.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,0),colors.HexColor("#1f4e79")),
        ("TEXTCOLOR",(0,0),(-1,0),colors.white),
        ("GRID",(0,0),(-1,-1),0.5,colors.grey),
        ("BOTTOMPADDING",(0,0),(-1,0),8),
        ("BACKGROUND",(0,1),(0,-1),colors.HexColor("#eaf2f8"))
    ]))
    story.append(tbl); story.append(Spacer(1,14))

    stats=Table([
      ["ATS","Overall","Average","Percentage","Integrity"],
      [str(data.get("ats_score",0)),
       str(s.get("overall_score",0)),
       str(s.get("average_score",0)),
       str(s.get("percentage",0))+"%",
       str(integ.get("integrity_score",100))+"%"]
    ])
    stats.setStyle(TableStyle([("GRID",(0,0),(-1,-1),0.5,colors.black),
                               ("BACKGROUND",(0,0),(-1,0),colors.lightgrey)]))
    story.append(stats); story.append(Spacer(1,12))

    chart=data.get("chart_path")
    if chart and os.path.exists(chart):
        story.append(Image(chart,width=420,height=220))
        story.append(Spacer(1,12))

    skills=data.get("skills",{})
    skilltbl=Table([
      ["Strong","Medium","Weak"],
      [", ".join(skills.get("strong",[])) or "-",
       ", ".join(skills.get("medium",[])) or "-",
       ", ".join(skills.get("weak",[])) or "-"]
    ])
    skilltbl.setStyle(TableStyle([("GRID",(0,0),(-1,-1),0.5,colors.black),
                                  ("BACKGROUND",(0,0),(-1,0),colors.lightgrey)]))
    story.append(skilltbl); story.append(Spacer(1,12))
    story.append(Paragraph("<b>Executive Summary</b>",styles["Heading2"]))
    story.append(Paragraph(data.get("executive_summary","N/A"),styles["BodyText"]))
    story.append(Spacer(1,12))
    story.append(Paragraph("<b>AI Feedback</b>",styles["Heading2"]))
    story.append(Paragraph(data.get("feedback","N/A").replace("\n","<br/>"),styles["BodyText"]))
    story.append(Spacer(1,12))
    story.append(Paragraph(f"<b>Hiring Recommendation:</b> {data.get('recommendation','N/A')}",styles["Heading2"]))
    doc.build(story)
