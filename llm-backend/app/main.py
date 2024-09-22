from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from app.database import init_db
from app.routers import conversations, llm_queries
from dotenv import load_dotenv
from app.models import APIError, APIErrorRequest, APIErrorDetails

# Load the environment variables
load_dotenv()

app = FastAPI()

@app.on_event("startup")
async def startup_event():
    await init_db()

app.include_router(conversations.router, prefix="/api")
app.include_router(llm_queries.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to the LLM Interaction API"}

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content=APIError(
            code=exc.status_code,
            message=exc.detail,
            request=APIErrorRequest(description=f"{request.method} {request.url}"),
            details=APIErrorDetails(description="Additional error details")
        ).dict()
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content=APIError(
            code=500,
            message="Internal Server Error",
            request=APIErrorRequest(description=f"{request.method} {request.url}"),
            details=APIErrorDetails(description=str(exc))
        ).dict()
    )
