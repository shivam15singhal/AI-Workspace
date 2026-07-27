from pydantic import BaseModel


class CreateEventRequest(BaseModel):
    summary: str
    description: str | None = None
    start: str
    end: str

class UpdateEventRequest(BaseModel):
    summary: str
    description: str | None = None
    start: str
    end: str    