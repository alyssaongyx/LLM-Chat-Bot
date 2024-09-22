import openai
from app.models import Prompt, AnonymizedPrompt
from typing import List, Tuple

class LLMService:
    def __init__(self, api_key: str):
        openai.api_key = os.getenv("OPENAI_API_KEY")

    async def generate_response(self, conversation_id: str, messages: List[Prompt]) -> Tuple[str, int]:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": m.role, "content": m.content} for m in messages]
        )
        
        content = response.choices[0].message.content
        tokens = response.usage.total_tokens
        
        # Store anonymized prompt and response
        await AnonymizedPrompt(
            conversation_id=conversation_id,
            prompt=messages[-1].content,
            response=content
        ).insert()
        
        return content, tokens
