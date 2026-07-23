import io
import contextlib


class PythonInterpreterTool:
    name = "python"

    description = (
        "Execute Python code safely. "
        "Arguments: code (string)."
    )

    def execute(
        self,
        code: str,
    ):
        output = io.StringIO()

        try:
            with contextlib.redirect_stdout(output):
                exec(code, {})

            return {
                "output": output.getvalue(),
            }

        except Exception as e:
            return {
                "error": str(e),
            }