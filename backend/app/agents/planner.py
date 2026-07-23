import json

from app.llm.service import LLMService

from app.agents.prompts import (
    PLANNER_TEMPLATE,
)
from app.tools.tool_registry import (
    get_tool_descriptions,
)

llm = LLMService()


class Planner:

    def plan(
        self,
        user_message: str,
    ):
        response = llm.generate(
            [
                {
                    "role": "system",
                    "content": PLANNER_TEMPLATE.format(
                        tools=get_tool_descriptions(),
                    ),
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
            plan = json.loads(
                response,
            )

        
            return plan

        except Exception as e:

        
            return {
                "tool": None,
            }