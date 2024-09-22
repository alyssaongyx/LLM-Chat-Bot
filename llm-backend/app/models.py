from datetime import datetime
from enum import Enum
from beanie import Document
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
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
    params: Dict[str, Any] = Field(default_factory=dict)
    tokens: int = Field(default=0, ge=0)
    
class ConversationFULL(BaseModel):
    id: str = Field(..., description="Unique identifier for the conversation")
    name: str = Field(..., description="Name of the conversation")
    params: Dict[str, Any] = Field(..., description="Parameters for the conversation")
    tokens: int = Field(..., description="Number of tokens used in the conversation")
    messages: List[Prompt] = Field(..., description="List of messages in the conversation")

class AnonymizedPrompt(Document):
    conversation_id: str
    prompt: str
    response: str
    timestamp: datetime = datetime.now()

class APIErrorRequest(BaseModel):
    description: str

class APIErrorDetails(BaseModel):
    description: str

class APIError(BaseModel):
    code: int
    message: str
    request: APIErrorRequest
    details: APIErrorDetails

class ConversationPOST(BaseModel):
    name: str = Field(..., description="Name of the conversation")
    params: Dict[str, Any] = Field(default_factory=dict, description="Additional parameters for the conversation")

class ConversationPUT(BaseModel):
    name: Optional[str] = Field(None, description="Updated name of the conversation")
    params: Optional[Dict[str, Any]] = Field(None, description="Updated parameters for the conversation")
