from pydantic_settings import BaseSettings
from typing import List
import json
from pydantic import Field


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "sqlite:///./app.db"
    
    # JWT
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS - Store as string and parse when needed
    # Use alias to match the .env file field name
    allowed_origins_str: str = Field(default="*", alias="ALLOWED_ORIGINS")
    
    # App
    APP_NAME: str = "UniverLiga Backend"
    DEBUG: bool = True

    BASE_PATH = "/api/v1"
    
    @property
    def ALLOWED_ORIGINS(self) -> List[str]:
        """Parse allowed_origins_str into a list of origins."""
        if self.allowed_origins_str.strip() == "*":
            return ["*"]
        # Try to parse as JSON array first
        try:
            return json.loads(self.allowed_origins_str)
        except json.JSONDecodeError:
            # If not JSON, treat as comma-separated string
            return [origin.strip() for origin in self.allowed_origins_str.split(",") if origin.strip()]
    
    class Config:
        env_file = ".env"
        # Use case-sensitive field names
        case_sensitive = False


settings = Settings()
