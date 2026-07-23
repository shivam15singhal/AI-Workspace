import json


def build_tool_message(tool_name: str, result):

    if "error" in result:
        body = (
            f"Tool: {tool_name}\n\n"
            f"Error:\n{result['error']}\n\n"
        )

    elif tool_name == "web_search":

        results = result.get("results", [])

        if not results:
            body = (
                "Tool: web_search\n\n"
                "No search results were found.\n\n"
            )

        else:

            text = ""

            for i, item in enumerate(results, start=1):
                text += (
                    f"{i}.\n"
                    f"Title: {item['title']}\n"
                    f"Summary: {item['snippet']}\n"
                    f"Source: {item['url']}\n\n"
                )

            body = (
                "Tool: web_search\n\n"
                "The following are LIVE web search results.\n\n"
                f"{text}"
            )

    else:
        body = str(result)

    return {
        "role": "system",
        "content": (
            body
            + "\n"
            + "IMPORTANT:\n"
            + "- These search results are newer than your internal knowledge.\n"
            + "- Treat them as the authoritative source.\n"
            + "- Answer ONLY using these search results.\n"
            + "- If the answer is present in the search results, do NOT say your knowledge cutoff prevents you from answering.\n"
            + "- Do not mention that a tool or search was used unless the user asks."
        ),
    }