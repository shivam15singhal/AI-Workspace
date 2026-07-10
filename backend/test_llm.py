from app.llm.service import LLMService

llm = LLMService()

title = llm.generate_title(
    "Explain Retrieval Augmented Generation"
)

print(title)