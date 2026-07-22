from app.tools.tool_executor import execute_tool


class Executor:

    def execute(
        self,
        tool_name: str,
        arguments: dict,
    ):
        try:
            return execute_tool(
                tool_name,
                arguments,
            )

        except Exception as e:
            return {
                "error": str(e),
            }