import json

from app.llm.service import LLMService

llm_service = LLMService()

TOOL_ROUTER_PROMPT = """
You are an AI tool router.

Decide whether the user's request requires a tool.

Available tools:

1. calculator
- Solve mathematical expressions.

2. datetime
- Return the current date or time.

If no tool is needed return:

{
    "tool": null
}

If a tool is required return ONLY valid JSON.

Example:

{
    "tool": "calculator",
    "arguments": {
        "expression": "25 * 8"
    }
}

Never explain.

Never use markdown.
"""
def choose_tool(
    user_message: str,
):
    response = llm_service.generate(
        [
            {
                "role": "system",
                "content": TOOL_ROUTER_PROMPT,
            },
            {
                "role": "user",
                "content": user_message,
            },
        ]
    )

    response = (
        response.replace(
            "```json",
            "",
        )
        .replace(
            "```",
            "",
        )
        .strip()
    )

    try:
        return json.loads(response)

    except Exception:
        return {
            "tool": None,
        }