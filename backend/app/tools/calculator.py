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
        try:
            result = eval(
                expression,
                {
                    "__builtins__": {},
                    "math": math,
                },
            )

            return {
                "result": result
            }

        except Exception as e:
            return {
                "error": str(e)
            }