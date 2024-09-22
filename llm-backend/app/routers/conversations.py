from fastapi import APIRouter, HTTPException
from app.models import Conversation, ConversationCreate, ConversationUpdate, Prompt, QueryRoleType
from app.services.llm_service import LLMService
from typing import List
from uuid import UUID

router = APIRouter()
llm_service = LLMService()

@router.post("/conversations", status_code=201, response_model=dict)
async def create_conversation(conversation: ConversationCreate):
    new_conversation = Conversation(**conversation.dict())
    await new_conversation.insert()
    return {"id": str(new_conversation.id)}

@router.get("/conversations", response_model=List[Conversation])
async def list_conversations():
    return await Conversation.find_all().to_list()

@router.get("/conversations/{id}", response_model=Conversation)
async def get_conversation(id: UUID):
    conversation = await Conversation.get(id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conversation

@router.put("/conversations/{id}", status_code=204)
async def update_conversation(id: UUID, update: ConversationUpdate):
    conversation = await Conversation.get(id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    update_data = update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(conversation, key, value)
    
    await conversation.save()

@router.delete("/conversations/{id}", status_code=204)
async def delete_conversation(id: UUID):
    conversation = await Conversation.get(id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    await conversation.delete()

@router.post("/queries", status_code=201, response_model=dict)
async def create_prompt(id: UUID, prompt: Prompt):
    conversation = await Conversation.get(id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    conversation.messages.append(prompt)
    
    if prompt.role == QueryRoleType.user:
        try:
            response, tokens = await llm_service.generate_response(str(conversation.id), conversation.messages)
            conversation.messages.append(Prompt(role=QueryRoleType.assistant, content=response))
            conversation.tokens += tokens
        except Exception as e:
            raise HTTPException(status_code=422, detail=str(e))
    
    await conversation.save()
    return {"id": str(conversation.id)}
