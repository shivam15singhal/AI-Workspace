from abc import ABC, abstractmethod
from typing import Generator


class BaseLLM(ABC):
    
    @abstractmethod
    def generate_response(
        self,
        messages: list[dict],
    ) -> str:
        """
        Generate a conversational response.
        """
        pass

    @abstractmethod
    def generate_title(

        self,
        first_message: str,
    ) -> str:
        """
        Generate a short title for a chat.
        """
        pass

    @abstractmethod
    def stream_response(
        self,
        messages: list[dict],
    ) -> Generator[str, None, None]:
        """
        Stream a response from the language model.
        """
        pass