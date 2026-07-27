from app.agents.planner import Planner
from app.agents.executor import Executor
from app.agents.messages import build_tool_message
from app.agents.python_agent import PythonAgent

from app.llm.service import LLMService

from app.tools.tool_registry import TOOLS
from app.tools.tool_context import ToolContext


class Agent:

    def __init__(self):
        self.planner = Planner()
        self.executor = Executor()
        self.llm = LLMService()
        self.python_agent = PythonAgent()

    def _prepare_conversation(
        self,
        conversation: list[dict],
        context: ToolContext | None = None,
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
        print("\n========== PLAN ==========")
        print(plan)
        print("==========================\n")

        tool = plan.get("tool")

        if tool is None:
            return conversation

        if tool not in TOOLS:
            return conversation

        arguments = plan.get(
            "arguments",
            {},
        )

        # -----------------------------
        # Python Agent
        # -----------------------------

        if tool == "python":

            generated_code = self.python_agent.generate_code(
                latest_user_message,
            )

            print("\n========== GENERATED PYTHON ==========")
            print(generated_code)
            print("======================================\n")

            result = self.executor.execute(
                "python",
                {
                    "code": generated_code,
                },
                context=context,
            )
            print("\n========== TOOL RESULT ==========")
            print(result)
            print("=================================\n")

        else:

            result = self.executor.execute(
                tool,
                arguments,
                context=context,
            )

        tool_message = build_tool_message(
            tool,
            result,
        )

        return conversation + [
            tool_message,
        ]
        import json

        print("\n================ TOOL MESSAGE ================")
        print(json.dumps(tool_message, indent=2))
        print("=============================================\n")

    def run(
        self,
        conversation: list[dict],
        context: ToolContext | None = None,
    ):
        conversation = self._prepare_conversation(
            conversation,
            context=context,
        )
        print("\n========== FINAL CONVERSATION ==========")
        for msg in conversation:
            print("--------------------------------")
            print(msg["role"])
            print(msg["content"])
            print("========================================\n")

        return self.llm.generate(
            conversation,
        )

    def stream(
        self,
        conversation: list[dict],
        context: ToolContext | None = None,
    ):
        conversation = self._prepare_conversation(
            conversation,
            context=context,
        )

        return self.llm.stream(
            conversation,
        )