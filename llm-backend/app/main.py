from fastapi import FastAPI, HTTPException
from app.database import init_db
from app.routers import conversations

app = FastAPI()

@app.on_event("startup")
async def startup_event():
    await init_db()

app.include_router(conversations.router)

@app.get("/")
async def root():
    return {"message": "Welcome to the LLM Interaction API"}

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return {
        "code": exc.status_code,
        "message": exc.detail,
        "request": {
            "url": str(request.url),
            "method": request.method,
        }
    }
