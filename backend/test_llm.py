from app.llm.service import LLMService

llm = LLMService()

messages = [
    {
        "role": "user",
        "content": "Say hello in one sentence."
    }
]

response = llm.generate(messages)

print(response)