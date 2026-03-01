from datetime import datetime
from typing import Optional, List, TYPE_CHECKING

from sqlalchemy import Boolean, Integer, String, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from ..database import Base

if TYPE_CHECKING:
    from .feedback import Feedback, FeedbackResponse


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    username: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    full_name: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_superuser: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        server_default=func.now()
    )
    updated_at: Mapped[Optional[datetime]] = mapped_column(
        onupdate=func.now(), nullable=True
    )
    role: Mapped[str] = mapped_column(String, default='technical', nullable=False,)


class Link(Base):
    __tablename__ = "users_links"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    id_parent: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    id_child: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)