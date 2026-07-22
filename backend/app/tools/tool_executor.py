from app.tools.tool_registry import TOOLS


def execute_tool(
    tool_name: str,
    arguments: dict,
):
    """
    Execute a registered tool.

    Raises:
        ValueError if the tool does not exist.
    """

    tool = TOOLS.get(tool_name)

    if tool is None:
        raise ValueError(
            f"Unknown tool: {tool_name}"
        )

    if arguments is None:
        arguments = {}

    return tool.execute(**arguments)