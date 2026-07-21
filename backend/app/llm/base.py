from abc import ABC, abstractmethod
from typing import Generator


class BaseLLM(ABC):

    @abstractmethod
    def generate_response(
        self,
        model: str,
        messages: list[dict],
    ) -> str:
        pass

    @abstractmethod
    def generate_title(
        self,
        model: str,
        first_message: str,
    ) -> str:
        pass

    @abstractmethod
    def stream_response(
        self,
        model: str,
        messages: list[dict],
    ) -> Generator[str, None, None]:
        pass