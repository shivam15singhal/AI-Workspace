from app.llm.base import BaseLLM


class OllamaLLM(BaseLLM):

    def generate_response(
        self,
        messages: list[dict],
    ) -> str:
        

        return "Ollama integration coming next."