from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from app.database import init_db
from app.routers import conversations
from dotenv import load_dotenv

# Load the environment variables
load_dotenv()

app = FastAPI()

@app.on_event("startup")
async def startup_event():
    await init_db()

app.include_router(conversations.router)

@app.get("/")
async def root():
    return {"message": "Welcome to the LLM Interaction API"}

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "code": exc.status_code,
            "message": exc.detail,
            "request": {
                "url": str(request.url),
                "method": request.method,
            }
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "code": 500,
            "message": "Internal Server Error",
            "detail": str(exc),
            "request": {
                "url": str(request.url),
                "method": request.method,
            }
        }
    )
