from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import asyncio

from .config import settings
from .database import engine, Base
from .routers import auth, users, feedback, quastionare, report

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

api_router = APIRouter(prefix=settings.BASE_PATH)

# Подключаем модули внутрь общего роутера
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(feedback.router)
api_router.include_router(quastionare.router)
api_router.include_router(report.router)

# Системные endpoints тоже туда
@api_router.get("/")
def read_root():
    return {
        "message": "Welcome to UniverLiga Backend API",
        "docs": "/docs",
        "version": "1.0.0"
    }

@api_router.get("/health")
def health_check():
    return {"status": "healthy"}

# И только один раз подключаем к app
app.include_router(api_router)


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level="info" if settings.DEBUG else "warning"
    )