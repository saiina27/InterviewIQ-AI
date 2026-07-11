
import matplotlib.pyplot as plt


def generate_score_chart(score: int, file_path: str):
    plt.figure()

    labels = ["Score", "Remaining"]
    values = [score, 100 - score]

    plt.bar(labels, values)
    plt.title("Interview Score Breakdown")

    plt.savefig(file_path)
    plt.close()

def generate_skill_chart(strong_count: int, weak_count: int, file_path: str):
    plt.figure()

    labels = ["Strong Skills", "Weak Skills"]
    values = [strong_count, weak_count]

    plt.bar(labels, values)
    plt.title("Skill Analysis")

    plt.savefig(file_path)
    plt.close()    