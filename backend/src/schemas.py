from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, List
from datetime import datetime
from enum import Enum


# User Schemas
class UserBase(BaseModel):
    email: str
    username: str
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    password: Optional[str] = None


class UserInDB(UserBase):
    id: int
    is_active: bool
    is_superuser: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class User(UserInDB):
    pass

class UserLink(BaseModel):
    id_parent: int
    id_child: int

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


# Authentication Schemas
class LoginRequest(BaseModel):
    username: str
    password: str


class RegisterRequest(UserCreate):
    pass


# Feedback Schemas
class FeedbackType(str, Enum):
    NEGATIVE = "negative"
    POSITIVE = "positive"
    NEUTRAL = "neutral"


# Feedback Base Schemas
class FeedbackBase(BaseModel):
    feedback_type: FeedbackType
    comment: str


class FeedbackCreate(FeedbackBase):
    user_id: int
    subcategory_ids: Optional[List[int]] = None


class FeedbackUpdate(BaseModel):
    feedback_type: Optional[FeedbackType] = None
    comment: Optional[str] = None


class FeedbackInDB(FeedbackBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


class Feedback(FeedbackInDB):
    pass


class FeedbackWithRelations(Feedback):
    user: Optional["User"] = None
    subcategories: Optional[List["FeedbackSubcategory"]] = None
    responses: Optional[List["FeedbackResponse"]] = None


# FeedbackSubcategory Schemas
class FeedbackSubcategoryBase(BaseModel):
    text: str
    feedback_type_relation: FeedbackType


class FeedbackSubcategoryCreate(FeedbackSubcategoryBase):
    pass


class FeedbackSubcategoryUpdate(BaseModel):
    text: Optional[str] = None
    feedback_type_relation: Optional[FeedbackType] = None


class FeedbackSubcategoryInDB(FeedbackSubcategoryBase):
    id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class FeedbackSubcategory(FeedbackSubcategoryInDB):
    pass


# FeedbackResponse Schemas
class FeedbackResponseBase(BaseModel):
    response_text: str


class FeedbackResponseCreate(FeedbackResponseBase):
    feedback_id: int
    responder_id: int
    subcategory_ids: Optional[List[int]] = None


class FeedbackResponseUpdate(BaseModel):
    response_text: Optional[str] = None
    subcategory_ids: Optional[List[int]] = None


class FeedbackResponseInDB(FeedbackResponseBase):
    id: int
    feedback_id: int
    responder_id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class FeedbackResponse(FeedbackResponseInDB):
    pass


class FeedbackResponseWithRelations(FeedbackResponse):
    feedback: Optional["Feedback"] = None
    responder: Optional["User"] = None
    subcategories: Optional[List["FeedbackSubcategory"]] = None


# Update forward references after all classes are defined
FeedbackWithRelations.model_rebuild()
FeedbackResponseWithRelations.model_rebuild()
