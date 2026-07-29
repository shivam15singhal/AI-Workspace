from app.tools.tool_executor import execute_tool

import logging

logger = logging.getLogger(__name__)
class Executor:

    def execute(
        self,
        tool_name: str,
        arguments: dict,
        context=None,
    ):
        
        try:
            result = execute_tool(
                tool_name,
                arguments,
                context,
            )

            
            return result

        except Exception as e:
            logger.exception("Tool execution failed")
            return {
                "error": str(e),
            }