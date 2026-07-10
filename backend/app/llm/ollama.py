import ollama

from app.llm.base import BaseLLM


class OllamaLLM(BaseLLM):
    """
    Ollama implementation of BaseLLM.
    """

    def generate_response(
        self,
        messages: list[dict],
    ) -> str:

        response = ollama.chat(
            model="llama3.2",
            messages=messages,
        )

        return response["message"]["content"]