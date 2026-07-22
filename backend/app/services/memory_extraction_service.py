import json

from app.llm.service import LLMService

llm = LLMService()


MEMORY_PROMPT = """
You are an AI memory extraction system.

Your task is to decide whether the user's latest message contains information
that should be stored as long-term memory.

Store memories whenever the user states any persistent fact about themselves.

Always save:

- Name
- Age
- Location
- Country
- City
- Occupation
- Education
- Skills
- Programming languages
- Preferences
- Likes
- Dislikes
- Goals
- Long-term plans
- Ongoing projects
- Personal facts
- Frequently used tools
- Favorite technologies

Do NOT save:

- Greetings
- Small talk
- Questions
- One-time requests
- Temporary situations
- Information that is already obvious from the conversation

Examples

User:
I live in Delhi.

Output:
{
  "save": true,
  "content": "Lives in Delhi",
  "memory_type": "personal",
  "importance": 4
}

User:
My favorite language is Python.

Output:
{
  "save": true,
  "content": "Favorite programming language is Python",
  "memory_type": "preference",
  "importance": 4
}

User:
I am building an AI Workspace.

Output:
{
  "save": true,
  "content": "Building an AI Workspace",
  "memory_type": "project",
  "importance": 5
}

User:
Hello

Output:
{
  "save": false
}

Return ONLY valid JSON.

Never explain anything.

Never use markdown.

Never wrap the JSON in code fences.
"""

def extract_memory(
    message: str,
):
    response = llm.generate(
        [
            {
                "role": "system",
                "content": MEMORY_PROMPT,
            },
            {
                "role": "user",
                "content": message,
            },
        ]
    )

    try:
        return json.loads(response)
    except Exception:
        return {
            "save": False,
        }