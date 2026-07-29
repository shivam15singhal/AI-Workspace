import json
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from app.llm.service import LLMService

llm_service = LLMService()
def choose_tool(user_message: str):
    print("\n" + "=" * 60)
    print("choose_tool() CALLED")
    print("Message:", user_message)
    print("=" * 60)

TOOL_ROUTER_PROMPT = """
You are an AI Tool Router.

Your job is to determine whether the user's request requires using a tool.

Return ONLY valid JSON.

Never explain.
Never use markdown.
Never return anything except JSON.

---------------------------------------
IMPORTANT RULES
---------------------------------------

1. If no tool is required:

{
    "tool": null
}

2. Always return valid JSON.

3. Always include an "arguments" object when a tool is selected.

4. For calendar.create and calendar.update:
- Convert ALL dates and times into ISO-8601 datetime strings.
- Never return natural language dates.
- Use the provided current datetime as the reference.

Examples:

❌ tomorrow 2 PM

✅ 2026-07-28T14:00:00+05:30

---------------------------------------
AVAILABLE TOOLS
---------------------------------------

1. calculator

Purpose:
Solve mathematical expressions.

Arguments:

{
    "expression": "25 * 8"
}

---------------------------------------

2. datetime

Purpose:
Return the current date or current time.

Arguments:

{}

---------------------------------------

3. calendar.create

Purpose:
Create a Google Calendar event.

Arguments:

{
    "summary": "",
    "description": "",
    "start": "",
    "end": ""
}

---------------------------------------

4. calendar.update

Purpose:
Update an existing calendar event.

Arguments:

{
    "query": "",
    "summary": "",
    "description": "",
    "start": "",
    "end": ""
}

---------------------------------------

5. calendar.delete

Purpose:
Delete a calendar event.

Arguments:

{
    "query": ""
}

---------------------------------------

6. calendar.list

Purpose:
List upcoming calendar events.

Arguments:

{
    "query": ""
}

---------------------------------------
EXAMPLES
---------------------------------------

User:
What is 125 * 36?

Response:

{
    "tool": "calculator",
    "arguments": {
        "expression": "125 * 36"
    }
}

---------------------------------------

User:
What time is it?

Response:

{
    "tool": "datetime",
    "arguments": {}
}

---------------------------------------

User:
Schedule my AI interview tomorrow at 2 PM.

Response:

{
    "tool": "calendar.create",
    "arguments": {
        "summary": "AI Interview",
        "description": "",
         "start": "<ISO-8601 datetime>",
        "end": "<ISO-8601 datetime>"
    }
}

---------------------------------------

User:
Delete my AI interview tomorrow.

Response:

{
    "tool": "calendar.delete",
    "arguments": {
        "query": "AI interview tomorrow"
    }
}

---------------------------------------

User:
Show my meetings tomorrow.

Response:

{
    "tool": "calendar.list",
    "arguments": {
        "query": "tomorrow"
    }
}

---------------------------------------

User:
Move my AI interview tomorrow to Friday 4 PM.

Response:

{
    "tool": "calendar.update",
    "arguments": {
        "query": "AI interview tomorrow",
        "summary": "AI Interview",
        "description": "",
         "start": "<ISO-8601 datetime>",
        "end": "<ISO-8601 datetime>"
    }
}
"""


def choose_tool(user_message: str):
    now = datetime.now(ZoneInfo("Asia/Kolkata"))

    current_date = now.strftime("%Y-%m-%d")
    current_day = now.strftime("%A")
    current_time = now.strftime("%H:%M")
    tomorrow = (now + timedelta(days=1)).strftime("%Y-%m-%d")

    system_prompt = (
        TOOL_ROUTER_PROMPT
        + f"""

Current date: {current_date}
Current day: {current_day}
Current time: {current_time}
Current timezone: Asia/Kolkata

IMPORTANT:

- Use the current date and day above as the ONLY reference.
- Resolve ALL relative dates (today, tomorrow, Friday, next Monday, next week, etc.) using this information.
- "Today" means {current_date}.
- "Tomorrow" means {tomorrow}.
- If the user says "Friday", choose the upcoming Friday after today's date.
- Always return ISO-8601 datetime strings with the +05:30 timezone.
- Never guess the current date.
"""
    )

    response = llm_service.generate(
        [
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": user_message,
            },
        ]
    )

    response = (
        response.replace("```json", "")
        .replace("```", "")
        .strip()
    )

    print("=" * 60)
    print("USER:", user_message)
    print("=" * 60)
    print(response)
    print("=" * 60)

    try:
        return json.loads(response)

    except Exception as e:
        print("Tool Router JSON Error:", e)
        print("Raw Response:", response)

        return {
            "tool": None
        }