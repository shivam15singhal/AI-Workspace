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

        content = response["message"]["content"].strip()

        if content.lower().startswith("assistant"):
            content = content[len("assistant"):].lstrip()

        return content

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
    ):
        stream = ollama.chat(
            model=model,
            messages=messages,
            stream=True,
        )

        skipping = True

        for chunk in stream:
            text = chunk["message"]["content"]

            if skipping:
                lower = text.strip().lower()

                if lower in ("assistant", "assistant:"):
                    continue

                if lower == "":
                    continue

                skipping = False

            yield text

    def generate_embedding(
        self,
        text: str,
    ):
        response = ollama.embeddings(
            model="bge-m3",
            prompt=text,
        )

        return response["embedding"]