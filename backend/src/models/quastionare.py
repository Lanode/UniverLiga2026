from ..database import Base

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Boolean, Integer, String, Text, ForeignKey, DateTime


class Quastionare(Base):
    __tablename__ = "quastionare"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name : Mapped[str] = mapped_column(String, index=True, nullable=False)
    data_create : Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    author_create : Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    start_date : Mapped[str] = mapped_column(DateTime, index=True, nullable=False)
    end_date : Mapped[str] = mapped_column(DateTime, index=True, nullable=False)

class Question(Base):
    __tablename__ = "questions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    quastionare_id : Mapped[int] = mapped_column(Integer, ForeignKey=True, nullable=False)
    name : Mapped[str] = mapped_column(String, index=True, nullable=False)
    description : Mapped[str] = mapped_column(String, index=True, nullable=False)
    type : Mapped[str] = mapped_column(String, index=True, nullable=False)
    extra: Mapped[str] = mapped_column(String, index=True, nullable=True)

class Answer(Base):
    __tablename__ = "answers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    quastionare_id: Mapped[int] = mapped_column(Integer, ForeignKey=True, nullable=False)
    question_id : Mapped[int] = mapped_column(Integer, ForeignKey=True, nullable=False)
    user : Mapped[int] = mapped_column(Integer, ForeignKey=True, nullable=False)
    answer : Mapped[str] = mapped_column(String, index=True, nullable=False)
