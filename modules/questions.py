import json

def load_questions():
    with open("data/questions.json", "r") as file:
        return json.load(file)