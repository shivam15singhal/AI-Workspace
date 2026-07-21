from app.llm.models import LLMModel
from app.llm.ollama import OllamaLLM


class LLMService:
    def __init__(self):
        self.llm = OllamaLLM()

        self.default_model = (
            LLMModel.LLAMA.value
        )

    def generate(
        self,
        messages: list[dict],
        model: str | None = None,
    ) -> str:
        return self.llm.generate_response(
            model or self.default_model,
            messages,
        )

    def generate_title(
        self,
        first_message: str,
        model: str | None = None,
    ) -> str:
        return self.llm.generate_title(
            model or self.default_model,
            first_message,
        )

    def stream(
        self,
        messages: list[dict],
        model: str | None = None,
    ):
        return self.llm.stream_response(
            model or self.default_model,
            messages,
        )

    def embedding(
        self,
        text: str,
    ):
        return self.llm.generate_embedding(
            text,
        )