from app.llm.service import LLMService


class PythonAgent:

    def __init__(self):
        self.llm = LLMService()

    def generate_code(
        self,
        user_request: str,
    ):
        prompt = [
            {
                "role": "system",
                "content": (
                    "You are a Python code generator.\n\n"
                    "Your only job is to generate valid Python code.\n\n"

                    "Rules:\n"
                     "- Return ONLY valid Python code.\n"
                     "- No explanation.\n"
                     "- No markdown.\n"
                     "- No ```.\n"
                     "- The code must execute successfully.\n"
                     "- Print the final answer. \n"
                     "- Do not use input().\n"
                     "- Prefer the shortest correct solution.\n"
                     "- Use built-in Python when possible.\n"
                ),
            },
            {
                "role": "user",
                "content": user_request,
            },
        ]

        code = self.llm.generate(prompt)

        code = (
            code.replace("```python", "")
            .replace("```", "")
            .strip()
        )

        return code