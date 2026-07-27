import json


def build_tool_message(tool_name: str, result):

    if isinstance(result, dict) and "error" in result:
        body = (
            f"Tool: {tool_name}\n\n"
            f"Status: FAILED\n\n"
            f"Error:\n{result['error']}"
        )

    elif tool_name == "calendar.create":

        body = (
            "Tool: calendar.create\n\n"
            "STATUS: SUCCESS\n\n"
            "A Google Calendar event was created successfully.\n\n"
            f"{json.dumps(result, indent=2)}"
        )

    elif tool_name == "calendar.update":

        body = (
            "Tool: calendar.update\n\n"
            "STATUS: SUCCESS\n\n"
            "The Google Calendar event was updated successfully.\n\n"
            f"{json.dumps(result, indent=2)}"
        )

    elif tool_name == "calendar.delete":

        body = (
            "Tool: calendar.delete\n\n"
            "STATUS: SUCCESS\n\n"
            "The Google Calendar event was deleted successfully.\n\n"
            f"{json.dumps(result, indent=2)}"
        )

    elif tool_name == "calendar.list":

        body = (
            "Tool: calendar.list\n\n"
            "STATUS: SUCCESS\n\n"
            "The following events were retrieved from Google Calendar.\n\n"
            f"{json.dumps(result, indent=2)}"
        )

    elif tool_name == "web_search":

        results = result.get("results", [])

        if not results:
            body = (
                "Tool: web_search\n\n"
                "STATUS: SUCCESS\n\n"
                "No search results found."
            )
        else:
            text = ""
            for i, item in enumerate(results, 1):
                text += (
                    f"{i}.\n"
                    f"Title: {item['title']}\n"
                    f"Summary: {item['snippet']}\n"
                    f"Source: {item['url']}\n\n"
                )

            body = (
                "Tool: web_search\n\n"
                "STATUS: SUCCESS\n\n"
                "These are LIVE search results.\n\n"
                f"{text}"
            )

    elif tool_name == "automation":

        body = (
            "Tool: automation\n\n"
            "STATUS: SUCCESS\n\n"
            "Automation completed successfully.\n\n"
            f"{json.dumps(result, indent=2)}"
        )

    else:

        if isinstance(result, dict) and "result" in result:
            body = (
                f"Tool: {tool_name}\n\n"
                f"STATUS: SUCCESS\n\n"
                f"Result:\n{result['result']}"
            )
        else:
            body = (
                f"Tool: {tool_name}\n\n"
                "STATUS: SUCCESS\n\n"
                f"{json.dumps(result, indent=2)}"
            )

    return {
        "role": "system",
        "content": (
            body
            + "\n\nIMPORTANT:\n"
            + "- The tool executed successfully.\n"
            + "- DO NOT say you cannot access the user's calendar.\n"
            + "- The tool output above is the actual result from the external system.\n"
            + "- Use it to answer naturally.\n"
            + "- Never claim you lack access after a successful tool execution."
        ),
    }