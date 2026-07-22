def build_tool_message(tool_name: str, result):
    return {
        "role": "system",
        "content": (
            f"A tool was executed.\n"
            f"Tool: {tool_name}\n"
            f"Result:\n{result}\n\n"
            "Use this information to answer the user's latest question. "
            "Do not mention the tool unless the user asks."
        ),
    }