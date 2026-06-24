def generate_questions(skills):

    questions = []

    question_bank = {

        "Python": [
            "What are Python decorators?",
            "Explain list vs tuple.",
            "How does memory management work in Python?"
        ],

        "Java": [
            "Explain JVM architecture.",
            "What is multithreading in Java?",
            "Difference between JDK, JRE and JVM?"
        ],

        "SQL": [
            "What is normalization?",
            "Explain different JOIN types.",
            "Difference between DELETE and TRUNCATE?"
        ],

        "React": [
            "What is Virtual DOM?",
            "Explain React Hooks.",
            "Difference between State and Props?"
        ],

        "Machine Learning": [
            "Difference between supervised and unsupervised learning?",
            "What is overfitting?",
            "Explain train-test split."
        ],

        "OpenCV": [
            "What is image processing?",
            "How does face detection work?",
            "Explain object detection."
        ],

        "Streamlit": [
            "Why use Streamlit?",
            "How does session_state work?",
            "Advantages of Streamlit?"
        ]
    }

    for skill in skills:

        if skill in question_bank:
            questions.extend(question_bank[skill])

        else:
            questions.append(
                f"Explain your experience with {skill}."
            )

    return questions