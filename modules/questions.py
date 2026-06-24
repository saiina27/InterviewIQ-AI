questions_data = {
    "Python Developer": {
        "Beginner": [
            "What is Python?",
            "What are lists in Python?",
            "Difference between list and tuple?"
        ],
        "Intermediate": [
            "Explain decorators.",
            "What is multithreading?",
            "Explain OOP concepts."
        ],
        "Advanced": [
            "Explain GIL.",
            "What are generators?",
            "Explain memory management in Python."
        ]
    },

    "Web Developer": {
        "Beginner": [
            "What is HTML?",
            "What is CSS?",
            "What is JavaScript?"
        ],
        "Intermediate": [
            "Explain DOM.",
            "What is React?",
            "What are APIs?"
        ],
        "Advanced": [
            "Explain JWT.",
            "Explain authentication vs authorization.",
            "Explain REST APIs."
        ]
    }
}

def load_questions():
    return questions_data 