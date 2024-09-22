from openai import OpenAI
import os
from dotenv import load_dotenv
from app.models import Prompt, AnonymizedPrompt
from typing import List, Tuple

load_dotenv()

class LLMService:
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable is not set")
        self.client = OpenAI(api_key=api_key)

    async def generate_response(self, conversation_id: str, messages: List[Prompt]) -> Tuple[str, int]:
        response = self.client.chat.completions.create(
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
