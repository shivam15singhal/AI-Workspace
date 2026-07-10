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
    

    def generate_title(
    self,
    first_message: str,
) -> str:
    

        response = ollama.chat(
        model="llama3.2",
        messages=[
            {
                "role": "system",
                "content": (
                    "Generate a short chat title."
                    "Use 2 to 5 words only."
                    "Do not use quotes."
                    "Return only the title."
                ),
            },
            {
                "role": "user",
                "content": first_message,
            },
        ],
    )

        return response["message"]["content"].strip()   