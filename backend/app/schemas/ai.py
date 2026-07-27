from typing import Any

from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str


class AgentResponse(BaseModel):
    intent: str
    parameters: dict[str, Any]
    reply: str


class ChatResponse(BaseModel):
    role: str
    message: str