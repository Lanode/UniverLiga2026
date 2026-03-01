from datetime import datetime
from typing import Optional, List
from enum import Enum as PyEnum

from sqlalchemy import Boolean, Integer, String, Text, ForeignKey, DateTime, Enum, Table, Column
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from .user import User

from ..database import Base


# Enum для типов фидбека
class FeedbackType(PyEnum):
    NEGATIVE = "negative"
    POSITIVE = "positive"
    NEUTRAL = "neutral"


# Таблица ассоциаций для many-to-many связи между Feedback и FeedbackSubcategory
feedback_subcategory_association = Table(
    "feedback_subcategory_association",
    Base.metadata,
    Column("feedback_id", ForeignKey("feedbacks.id"), primary_key=True),
    Column("subcategory_id", ForeignKey("feedback_subcategories.id"), primary_key=True),
)

# Таблица ассоциаций для many-to-many связи между FeedbackResponse и FeedbackSubcategory
feedback_response_subcategory_association = Table(
    "feedback_response_subcategory_association",
    Base.metadata,
    Column("response_id", ForeignKey("feedback_responses.id"), primary_key=True),
    Column("subcategory_id", ForeignKey("feedback_subcategories.id"), primary_key=True),
)


class Feedback(Base):
    __tablename__ = "feedbacks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    feedback_type: Mapped[FeedbackType] = mapped_column(
        Enum(FeedbackType, native_enum=False, length=20),
        nullable=False
    )
    comment: Mapped[str] = mapped_column(Text, nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    user_to_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    allow_feedback: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now()
    )
    
    # Relationships
    user: Mapped["User"] = relationship("User", foreign_keys=[user_id])
    user_to: Mapped["User"] = relationship("User", foreign_keys=[user_to_id])
    subcategories: Mapped[List["FeedbackSubcategory"]] = relationship(
        "FeedbackSubcategory",
        secondary=feedback_subcategory_association,
        back_populates="feedbacks"
    )
    responses: Mapped[List["FeedbackResponse"]] = relationship(
        "FeedbackResponse",
        back_populates="feedback",
        cascade="all, delete-orphan"
    )


class FeedbackSubcategory(Base):
    __tablename__ = "feedback_subcategories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    text: Mapped[str] = mapped_column(String(255), nullable=False)
    feedback_type_relation: Mapped[FeedbackType] = mapped_column(
        Enum(FeedbackType, native_enum=False, length=20),
        nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now()
    )
    department: Mapped[str] = mapped_column(String(255), nullable=False)
    
    # Relationships
    feedbacks: Mapped[List["Feedback"]] = relationship(
        "Feedback",
        secondary=feedback_subcategory_association,
        back_populates="subcategories"
    )
    responses: Mapped[List["FeedbackResponse"]] = relationship(
        "FeedbackResponse",
        secondary=feedback_response_subcategory_association,
        back_populates="subcategories"
    )


class FeedbackResponse(Base):
    __tablename__ = "feedback_responses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    feedback_id: Mapped[int] = mapped_column(ForeignKey("feedbacks.id"), nullable=False)
    response_text: Mapped[str] = mapped_column(Text, nullable=False)
    responder_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now()
    )
    
    # Relationships
    feedback: Mapped["Feedback"] = relationship("Feedback", back_populates="responses")
    responder: Mapped["User"] = relationship("User")
    subcategories: Mapped[List["FeedbackSubcategory"]] = relationship(
        "FeedbackSubcategory",
        secondary=feedback_response_subcategory_association,
        back_populates="responses"
    )
