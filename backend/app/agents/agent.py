from app.agents.planner import Planner
from app.agents.executor import Executor
from app.agents.messages import build_tool_message
from app.tools.tool_registry import TOOLS
from app.llm.service import LLMService


class Agent:

    def __init__(self):
        self.planner = Planner()
        self.executor = Executor()
        self.llm = LLMService()

    def _prepare_conversation(
        self,
        conversation: list[dict],
    ):
        """
        Prepare the conversation before
        sending it to the LLM.
        """

        latest_user_message = None

        for message in reversed(conversation):
            if message["role"] == "user":
                latest_user_message = message["content"]
                break

        if latest_user_message is None:
            return conversation

        plan = self.planner.plan(
            latest_user_message,
        )

        tool = plan.get("tool")

        if tool is None:
            return conversation

        if tool not in TOOLS:
            return conversation

        arguments = plan.get(
            "arguments",
            {},
        )

        result = self.executor.execute(
            tool,
            arguments,
        )

        tool_message = build_tool_message(
            tool,
            result,
        )

        return conversation + [
            tool_message,
        ]

    def run(
        self,
        conversation: list[dict],
    ):
        conversation = self._prepare_conversation(
            conversation,
        )

        return self.llm.generate(
            conversation,
        )

    def stream(
        self,
        conversation: list[dict],
    ):
        conversation = self._prepare_conversation(
            conversation,
        )

        return self.llm.stream(
            conversation,
        )