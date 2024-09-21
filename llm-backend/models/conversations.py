from beanie import Document
from pydantic import BaseModel
from datetime import datetime
from typing import List

class Message(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class Conversation(Document):
    conversation_id: str
    messages: List[Message]
    created_at: datetime = datetime.utcnow()

    class Settings:
        collection = "conversations"
