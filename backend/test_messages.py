from app.database.database import SessionLocal
from app.services.message_service import get_conversation_messages

db = SessionLocal()

messages = get_conversation_messages(
    db=db,
    chat_id=1,
)

print(messages)