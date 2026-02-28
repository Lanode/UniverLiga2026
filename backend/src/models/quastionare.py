from ..database import Base

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Boolean, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from datetime import datetime
from typing import Optional


class Quastionare(Base):
    __tablename__ = "quastionare"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String, index=True, nullable=False)
    data_create: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    author_create: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    start_date: Mapped[datetime] = mapped_column(DateTime, index=True, nullable=False)
    end_date: Mapped[datetime] = mapped_column(DateTime, index=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class Question(Base):
    __tablename__ = "questions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    quastionare_id: Mapped[int] = mapped_column(Integer, ForeignKey("quastionare.id"), nullable=False)
    name: Mapped[str] = mapped_column(String, index=True, nullable=False)
    description: Mapped[str] = mapped_column(String, index=True, nullable=False)
    type: Mapped[str] = mapped_column(String, index=True, nullable=False)
    extra: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class Answer(Base):
    __tablename__ = "answers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    quastionare_id: Mapped[int] = mapped_column(Integer, ForeignKey("quastionare.id"), nullable=False)
    question_id: Mapped[int] = mapped_column(Integer, ForeignKey("questions.id"), nullable=False)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    answer: Mapped[str] = mapped_column(String, index=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
