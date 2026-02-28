from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import asyncio

from .config import settings
from .database import engine, Base
from .routers import auth, users, items

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="UniverLiga Backend API with JWT Authentication",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Async function to create database tables
async def create_tables():
    """Create database tables asynchronously."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# Startup event to create tables
@app.on_event("startup")
async def on_startup():
    """Create database tables on application startup."""
    await create_tables()
    print("Database tables created successfully")

# Configure CORS - Allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_PREFIX = "/api/v1"

# Include routers
app.include_router(auth.router, prefix=API_PREFIX)
app.include_router(users.router, prefix=API_PREFIX)
app.include_router(items.router, prefix=API_PREFIX)


@app.get("/")
def read_root():
    """Root endpoint with API information."""
    return {
        "message": "Welcome to UniverLiga Backend API",
        "docs": "/docs",
        "version": "1.0.0"
    }


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level="info" if settings.DEBUG else "warning"
    )