from app.llm.service import LLMService

llm = LLMService()

messages = [
    {
        "role": "user",
        "content": "Explain FastAPI in one paragraph."
    }
]

for chunk in llm.stream(messages):
    print(chunk, end="", flush=True)