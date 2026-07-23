from app.tools.tool_executor import execute_tool


class Executor:

    def execute(
        self,
        tool_name: str,
        arguments: dict,
    ):
        
        try:
            result = execute_tool(
                tool_name,
                arguments,
            )

            
            return result

        except Exception as e:
            print(e)
            return {
                "error": str(e),
            }