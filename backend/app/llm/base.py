from abc import ABC, abstractmethod


class BaseLLM(ABC):
    """
    Abstract base class for all LLM providers.
    """

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