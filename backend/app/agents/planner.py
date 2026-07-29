import json
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
from app.llm.service import LLMService
from app.agents.prompts import PLANNER_TEMPLATE
from app.tools.tool_registry import get_tool_descriptions

llm = LLMService()


class Planner:

    def plan(
        self,
        user_message: str,
    ):
        prompt = PLANNER_TEMPLATE.replace(
            "{tools}",
            get_tool_descriptions(),
        )
        now = datetime.now(ZoneInfo("Asia/Kolkata"))

        date_context = f"""
    Current date and time:
    - Current date: {now.strftime("%Y-%m-%d")}
    - Current day: {now.strftime("%A")}
    - Current time: {now.strftime("%H:%M")}
    - Tomorrow: {(now + timedelta(days=1)).strftime("%Y-%m-%d")}

IMPORTANT:
When the user says "today", "tomorrow", "Friday", "next Monday", etc.,
always resolve them relative to the current date above.

For calendar tools, always output complete ISO-8601 datetime strings.
"""

        response = llm.generate(
            [
                {
                    "role": "system",
                    "content": prompt + "\n\n" + date_context,
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

        try:
            return json.loads(response)

        except Exception as e:
            print("Planner JSON parse error:", e)
            print(response)

            return {
            "tool": None,
        }