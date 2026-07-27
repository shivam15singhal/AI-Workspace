from app.core.config import settings
from app.llm.gemini import GeminiLLM
from app.llm.models import LLMModel
from app.llm.ollama import OllamaLLM


class LLMService:
    def __init__(self):
        provider = settings.LLM_PROVIDER.lower()

        if provider == "gemini":
            self.llm = GeminiLLM()
            self.default_model = settings.GEMINI_MODEL
        else:
            self.llm = OllamaLLM()
            self.default_model = (
                settings.OLLAMA_MODEL
                if hasattr(settings, "OLLAMA_MODEL")
                else LLMModel.LLAMA.value
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