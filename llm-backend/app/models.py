from enum import Enum
from beanie import Document
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime
from uuid import UUID, uuid4

class QueryRoleType(str, Enum):
    system = "system"
    user = "user"
    assistant = "assistant"
    function = "function"

class Prompt(BaseModel):
    role: QueryRoleType
    content: str

class Conversation(Document):
    id: UUID = Field(default_factory=uuid4)
    name: str = Field(..., max_length=200)
    params: Dict = Field(default_factory=dict)
    tokens: int = Field(default=0, ge=0)
    messages: List[Prompt] = Field(default_factory=list)

class ConversationCreate(BaseModel):
    name: str = Field(..., max_length=200)
    params: Dict = Field(default_factory=dict)

class ConversationUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=200)
    params: Optional[Dict] = None

class AnonymizedPrompt(Document):
    conversation_id: str
    prompt: str
    response: str
    timestamp: datetime = datetime.now()
