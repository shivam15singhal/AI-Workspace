from app.llm.service import LLMService


llm = LLMService()

response = llm.generate(
    [
        {
            "role": "user",
            "content": "Hello"
        }
    ]
)

print(response)