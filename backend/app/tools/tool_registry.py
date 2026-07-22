from app.tools.calculator import (
    CalculatorTool,
)

from app.tools.datetime_tool import (
    DateTimeTool,
)

TOOLS = {
    "calculator": CalculatorTool(),

    "datetime": DateTimeTool(),
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