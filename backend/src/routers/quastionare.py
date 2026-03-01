from fastapi import APIRouter, Depends, HTTPException, status

from .. import schemas
from ..auth import get_current_active_user

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..models import Question
from ..database import get_db

router = APIRouter(prefix="/quastionare", tags=["quastionare"])

@router.post("/") #
async def create_quastionare(
        current_user: schemas.User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_db)
):
    return {"status": "created"}

@router.get("/{item_id}")
async def read_quastionare(
        item_id: int,
        current_user: schemas.User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_db)
):
    result = await get_all_questions(db, item_id)
    return {"result": result}


async def get_all_questions(db: AsyncSession, quastionare_id: int):
    result = await db.execute(
        select(Question).where(Question.quastionare_id == quastionare_id)
    )
    return result.scalars().all()