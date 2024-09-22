from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse
from app.models import AnonymizedPrompt, Conversation, Prompt, QueryRoleType
from app.services.llm_service import LLMService
from uuid import UUID
from openai import RateLimitError, APIError
from pydantic import ValidationError

router = APIRouter(
    prefix="/queries",
    tags=["LLM Queries"],
    responses={404: {"description": "Not found"}},
)

llm_service = LLMService()

@router.post("/", status_code=201, summary="Creates a new Prompt query")
async def create_prompt(prompt: Prompt, id: UUID = Query(...)):
    """
    Create a new prompt for a specific conversation.
    """
    try:
        conversation = await Conversation.get(id)
        if not conversation:
            raise HTTPException(
                status_code=404,
                detail="Specified resource(s) was not found"
            )
        
        # Validate the prompt
        if not isinstance(prompt.content, str) or len(prompt.content.strip()) == 0:
            raise ValidationError("Invalid prompt content")
        
        # Save the prompt
        new_prompt = AnonymizedPrompt(
            conversation_id=str(id),
            prompt=prompt.content,
            response=""  # This will be filled later for user prompts
        )
        await new_prompt.insert()
        
        if prompt.role == QueryRoleType.user:
            messages = await AnonymizedPrompt.find({"conversation_id": str(id)}).to_list()
            prompts = [Prompt(role=QueryRoleType.user if m.prompt else QueryRoleType.assistant, content=m.prompt or m.response) for m in messages]
            prompts.append(prompt)
            response, tokens = await llm_service.generate_response(str(conversation.id), prompts)
            
            assistant_prompt = AnonymizedPrompt(
                conversation_id=str(id),
                prompt="",
                response=response
            )
            await assistant_prompt.insert()
            
            conversation.tokens += tokens
            await conversation.save()
        
        return JSONResponse(
            status_code=201,
            content={"id": str(conversation.id)},
        )
    except ValidationError:
        raise HTTPException(status_code=422, detail="Unable to create resource")
    except ValueError as ve:
        raise HTTPException(status_code=400, detail="Invalid parameters provided")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")