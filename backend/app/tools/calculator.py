import ast
import math
import operator

from app.tools.base import BaseTool


class CalculatorTool(BaseTool):
    name = "calculator"

    description = (
        "Safely evaluates mathematical expressions."
    )

    _OPERATORS = {
        ast.Add: operator.add,
        ast.Sub: operator.sub,
        ast.Mult: operator.mul,
        ast.Div: operator.truediv,
        ast.FloorDiv: operator.floordiv,
        ast.Mod: operator.mod,
        ast.Pow: operator.pow,
        ast.USub: operator.neg,
        ast.UAdd: operator.pos,
    }

    _ALLOWED_FUNCTIONS = {
        "sqrt": math.sqrt,
        "sin": math.sin,
        "cos": math.cos,
        "tan": math.tan,
        "log": math.log,
        "log10": math.log10,
        "exp": math.exp,
        "factorial": math.factorial,
        "ceil": math.ceil,
        "floor": math.floor,
        "fabs": math.fabs,
    }

    _ALLOWED_CONSTANTS = {
        "pi": math.pi,
        "e": math.e,
    }

    def execute(
        self,
        expression: str,
        **kwargs,
    ) -> dict:
        """
        Safely evaluate a mathematical expression.
        """

        try:
            tree = ast.parse(expression, mode="eval")
            result = self._evaluate(tree.body)

            return {
                "result": result,
            }

        except (
            ValueError,
            TypeError,
            ZeroDivisionError,
            SyntaxError,
        ) as exc:
            return {
                "error": str(exc),
            }

    def _evaluate(self, node):
        if isinstance(node, ast.Constant):
            if isinstance(node.value, (int, float)):
                return node.value
            raise ValueError("Only numeric constants are allowed.")

        if isinstance(node, ast.BinOp):
            operator_func = self._OPERATORS.get(type(node.op))

            if operator_func is None:
                raise ValueError("Unsupported operator.")

            return operator_func(
                self._evaluate(node.left),
                self._evaluate(node.right),
            )

        if isinstance(node, ast.UnaryOp):
            operator_func = self._OPERATORS.get(type(node.op))

            if operator_func is None:
                raise ValueError("Unsupported unary operator.")

            return operator_func(
                self._evaluate(node.operand),
            )

        if isinstance(node, ast.Name):
            if node.id in self._ALLOWED_CONSTANTS:
                return self._ALLOWED_CONSTANTS[node.id]

            raise ValueError(f"Unknown constant '{node.id}'.")

        if isinstance(node, ast.Call):
            if not isinstance(node.func, ast.Name):
                raise ValueError("Invalid function call.")

            function = self._ALLOWED_FUNCTIONS.get(node.func.id)

            if function is None:
                raise ValueError(
                    f"Function '{node.func.id}' is not allowed."
                )

            arguments = [
                self._evaluate(arg)
                for arg in node.args
            ]

            return function(*arguments)

        raise ValueError("Unsupported expression.")