from abc import ABC
from abc import abstractmethod


class BaseTool(ABC):

    name: str

    description: str

    @abstractmethod
    def execute(
        self,
        **kwargs,
    ):
        pass