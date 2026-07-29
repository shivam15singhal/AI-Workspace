from google import genai

from app.core.config import settings
from app.llm.base import BaseLLM


class GeminiLLM(BaseLLM):
    """
    Gemini implementation of BaseLLM.
    """

    def __init__(self):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)

    def generate_response(
        self,
        model: str,
        messages: list[dict],
    ) -> str:
        prompt = self._messages_to_prompt(messages)

        response = self.client.models.generate_content(
            model=model,
            contents=prompt,
        )

        return response.text

    def generate_title(
        self,
        model: str,
        first_message: str,
    ) -> str:
        prompt = f"""
You generate chat titles.

Rules:
- Maximum 5 words.
- No markdown.
- No punctuation.
- No explanation.
- Return ONLY the title.

User message:
{first_message}
"""

        response = self.client.models.generate_content(
            model=model,
            contents=prompt,
        )

        return response.text.strip()

    def stream_response(
        self,
        model: str,
        messages: list[dict],
    ):
        prompt = self._messages_to_prompt(messages)

        stream = self.client.models.generate_content_stream(
            model=model,
            contents=prompt,
        )

        for chunk in stream:
            if chunk.text:
                yield chunk.text

    def generate_embedding(
        self,
        text: str,
    ):
        response = self.client.models.embed_content(
            model=settings.GEMINI_EMBEDDING_MODEL,
            contents=text,
        )

        return response.embeddings[0].values

    def _messages_to_prompt(
        self,
        messages: list[dict],
    ) -> str:
        prompt = ""

        for message in messages:
            role = message["role"].capitalize()
            content = message["content"]

            prompt += f"{role}: {content}\n"

        return prompt