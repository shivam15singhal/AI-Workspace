import ollama

from typing import Generator

from app.llm.base import BaseLLM


class OllamaLLM(BaseLLM):
    """
    Ollama implementation of BaseLLM.
    """

    def generate_response(
        self,
        model: str,
        messages: list[dict],
    ) -> str:

        response = ollama.chat(
            model=model,
            messages=messages,
        )

        return response["message"]["content"]

    def generate_title(
        self,
        model: str,
        first_message: str,
    ) -> str:

        response = ollama.chat(
            model=model,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You generate chat titles.\n"
                        "Rules:\n"
                        "- Maximum 5 words.\n"
                        "- No markdown.\n"
                        "- No punctuation.\n"
                        "- No explanation.\n"
                        "- Return ONLY the title."
                    ),
                },
                {
                    "role": "user",
                    "content": first_message,
                },
            ],
        )

        return response["message"]["content"].strip()

    def stream_response(
        self,
        model: str,
        messages: list[dict],
    ) -> Generator[str, None, None]:

        stream = ollama.chat(
            model=model,
            messages=messages,
            stream=True,
        )

        for chunk in stream:
            yield chunk["message"]["content"]

    def generate_embedding(
        self,
        text: str,
    ):
        response = ollama.embeddings(
            model="bge-m3",
            prompt=text,
        )

        return response["embedding"]