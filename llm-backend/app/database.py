import motor.motor_asyncio
from beanie import init_beanie
from app.models import Conversation, AnonymizedPrompt

async def init_db():
    client = motor.motor_asyncio.AsyncIOMotorClient("mongodb://mongodb:27017")
    await init_beanie(database=client.llm_db, document_models=[Conversation, AnonymizedPrompt])
