import motor.motor_asyncio
from beanie import init_beanie
from app.models import Conversation, AnonymizedPrompt
import os
from dotenv import load_dotenv

load_dotenv()

async def init_db():
    # Use the environment variable or default to localhost if not set
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    client = motor.motor_asyncio.AsyncIOMotorClient(mongodb_url)
    await init_beanie(database=client.llm_db, document_models=[Conversation, AnonymizedPrompt])
