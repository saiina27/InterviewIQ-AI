from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer("all-MiniLM-L6-v2")


def evaluate_answer(question, answer):
    """
    Returns AI-based semantic score (0-100)
    """

    ideal_answers = {
        "What is Python?": "Python is a high-level programming language used for web development, AI, automation and data science.",
        "What is OOP?": "OOP is Object Oriented Programming based on objects and classes.",
        "What is HTML?": "HTML is a markup language used to structure web pages.",
        "What is CSS?": "CSS is used to style web pages and make them visually attractive.",
        "What is JavaScript?": "JavaScript is used to make web pages interactive."
    }

    reference = ideal_answers.get(question, question)

    embeddings = model.encode([answer, reference], convert_to_tensor=True)

    similarity = util.pytorch_cos_sim(embeddings[0], embeddings[1]).item()

    score = round(similarity * 100)

    return min(max(score, 0), 100)