import json

from google import genai

from app.core.config import settings

# Create Gemini client
client = genai.Client(api_key=settings.GEMINI_API_KEY)

SYSTEM_PROMPT = """
You are an AI Workspace Calendar Assistant.

Your job is to understand the user's request and return ONLY valid JSON.

Available intents:
- create_event
- update_event
- delete_event
- list_events

Always return this JSON format:

{
  "intent": "",
  "parameters": {},
  "reply": ""
}

Examples:

User:
Schedule interview tomorrow at 3 PM.

Response:
{
  "intent": "create_event",
  "parameters": {
    "summary": "Interview",
    "description": "",
    "start": "tomorrow 3 PM",
    "end": "tomorrow 4 PM"
  },
  "reply": "I'll schedule your interview."
}

User:
Delete tomorrow's meeting.

Response:
{
  "intent": "delete_event",
  "parameters": {
    "query": "tomorrow meeting"
  },
  "reply": "I'll delete that meeting."
}

User:
What meetings do I have tomorrow?

Response:
{
  "intent": "list_events",
  "parameters": {
    "query": "tomorrow"
  },
  "reply": "I'll check your calendar."
}

Return ONLY JSON.
"""


def understand_calendar_request(message: str):
    prompt = f"{SYSTEM_PROMPT}\n\nUser:\n{message}"

    response = client.models.generate_content(
        model=settings.GEMINI_MODEL,
        contents=prompt,
    )

    text = response.text.strip()

    # Remove markdown if the model wraps JSON in ```json
    if text.startswith("```"):
        text = text.replace("```json", "")
        text = text.replace("```", "")
        text = text.strip()

    return json.loads(text)