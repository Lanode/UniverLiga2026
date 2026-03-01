from datetime import datetime
from typing import Optional, List, TYPE_CHECKING

from sqlalchemy import Boolean, Integer, String, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from ..database import Base

class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

class TaskLink(Base):
    __tablename__ = "task_links"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    task_id: Mapped[int] = mapped_column(Integer, ForeignKey("tasks.id"))
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))