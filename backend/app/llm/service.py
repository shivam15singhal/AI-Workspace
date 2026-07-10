from app.llm.ollama import OllamaLLM


class LLMService:

    def __init__(self):
        self.llm = OllamaLLM()

    def generate(
        self,
        messages: list[dict],
    ) -> str:
        return self.llm.generate_response(messages)

    def generate_title(
        self,
        first_message: str,
    ) ->    str:
        return self.llm.generate_title(first_message)   