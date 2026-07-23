from app.tools.calculator import (
    CalculatorTool,
)

from app.tools.datetime_tool import (
    DateTimeTool,
)
from app.tools.web_search_tool import WebSearchTool

from app.tools.python_interpreter import (
    PythonInterpreterTool,
)

TOOLS = {
    "calculator": CalculatorTool(),

    "datetime": DateTimeTool(),
    "web_search": WebSearchTool(),
    "python": PythonInterpreterTool(),
}
def get_tool_descriptions():
    """
    Return all registered tools
    in a planner-friendly format.
    """

    descriptions = []

    for tool in TOOLS.values():
        descriptions.append(
            f"{tool.name}\n"
            f"- {tool.description}"
        )

    return "\n\n".join(
        descriptions,
    )