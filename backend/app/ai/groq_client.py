from groq import Groq

from backend.app.config import settings


client = Groq(
    api_key=settings.GROQ_API_KEY
)


MODEL_NAME = "openai/gpt-oss-120b"



def generate_content(prompt: str) -> str:

    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2,
    )

    return response.choices[0].message.content
