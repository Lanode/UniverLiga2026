from fastapi import APIRouter, Depends, HTTPException, status

from .. import schemas
from ..auth import get_current_active_user, get_current_superuser

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..models import Feedback
from ..database import get_db


router = APIRouter(prefix="/feedback", tags=["feedback"])

@router.post("/") #
async def create_feedback(
        current_user: schemas.User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_db)
):
    return {"status": "created"}

@router.get("/{item_id}")
async def read_feedback(
        item_id: int,
        current_user: schemas.User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_db)
):

    result = await db.execute(select(Feedback).where(Feedback.id == item_id))
    return {"result": result.scalar_one_or_none()}

