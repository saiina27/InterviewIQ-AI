from backend.app.ai.gemini_client import generate_content


class AIGateway:
    """
    Central gateway for all AI model calls.

    Currently:
        Gemini is the primary provider.

    Future:
        Additional providers such as Groq can be added here
        without changing the services that consume the gateway.
    """

    def generate(self, prompt: str) -> str:
        return generate_content(prompt)


ai_gateway = AIGateway()
