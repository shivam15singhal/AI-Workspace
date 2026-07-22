import math

from app.tools.base import BaseTool


class CalculatorTool(BaseTool):

    name = "calculator"

    description = (
        "Evaluates mathematical expressions."
    )

    def execute(
        self,
        expression: str,
        **kwargs,
    ):
        return eval(
            expression,
            {
                "__builtins__": {},
                "math": math,
            },
        )