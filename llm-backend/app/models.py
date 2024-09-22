from beanie import Document
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Message(BaseModel):
    role: str
    content: str

class Conversation(Document):
    title: str
    messages: List[Message] = []
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()

class ConversationCreate(BaseModel):
    title: str

class ConversationUpdate(BaseModel):
    title: Optional[str] = None

class AnonymizedPrompt(Document):
    conversation_id: str
    prompt: str
    response: str
    timestamp: datetime = datetime.now()
