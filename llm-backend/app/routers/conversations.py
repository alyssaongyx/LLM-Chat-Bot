from fastapi import APIRouter, HTTPException, Response
from app.models import AnonymizedPrompt, Conversation, ConversationPOST, ConversationFULL, Prompt, ConversationPUT, QueryRoleType
from app.services.llm_service import LLMService
from typing import List
from uuid import UUID

router = APIRouter(
    prefix="/conversations",
    tags=["Conversations"],
    responses={404: {"description": "Not found"}},
)

llm_service = LLMService()

@router.post("/", status_code=201, response_model=dict, summary="Creates a new Conversation with an LLM model")
async def create_conversation(conversation: ConversationPOST):
    """
    Create a new conversation with the following parameters:
    - **name**: A string that represents the name of the conversation
    - **params**: A dictionary of parameters for the conversation
    """
    try:
        new_conversation = Conversation(name=conversation.name, params=conversation.params)
        await new_conversation.insert()
        return {"id": str(new_conversation.id)}
    except ValueError as ve:
        raise HTTPException(status_code=400, detail="Invalid parameters provided")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/", response_model=List[Conversation], summary="Retrieve a user's Conversations")
async def list_conversations():
    """
    Retrieve all conversations for the current user.
    """
    try:
        return await Conversation.find_all().to_list()
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/{id}", response_model=ConversationFULL, summary="Retrieves the Conversation History")
async def get_conversation(id: UUID):
    """
    Retrieve a specific conversation by its ID.
    """
    try:
        conversation = await Conversation.get(id)
        if not conversation:
            raise HTTPException(
                status_code=404,
                detail="Specified resource(s) was not found"
            )
        anonymized_prompts = await AnonymizedPrompt.find({"conversation_id": str(id)}).to_list()
        messages = [
            Prompt(role=QueryRoleType.user if ap.prompt else QueryRoleType.assistant, content=ap.prompt or ap.response)
            for ap in anonymized_prompts
        ]
        return ConversationFULL(
            id=str(conversation.id),
            name=conversation.name,
            params=conversation.params,
            tokens=conversation.tokens,
            messages=messages
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

@router.put("/{id}", status_code=204, summary="Updates the LLM properties of a Conversation")
async def update_conversation(id: UUID, update: ConversationPUT):
    """
    Update a specific conversation by its ID.
    """
    try:
        conversation = await Conversation.get(id)
        if not conversation:
            raise HTTPException(status_code=404, detail="Specified resource(s) was not found")
        
        if update.name is not None:
            conversation.name = update.name
        if update.params is not None:
            conversation.params.update(update.params)
        
        await conversation.save()
        return Response(status_code=204)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail="Invalid parameters provided")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

@router.delete("/{id}", status_code=204, summary="Deletes the Conversation")
async def delete_conversation(id: UUID):
    """
    Delete a specific conversation by its ID.
    """
    try:
        conversation = await Conversation.get(id)
        if not conversation:
            raise HTTPException(
                status_code=404,
                detail="Specified resource(s) was not found"
            )
        await conversation.delete()
        return Response(status_code=204)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
