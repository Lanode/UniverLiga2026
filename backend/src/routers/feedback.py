from fastapi import APIRouter, Depends, HTTPException, status

from .. import schemas
from ..auth import get_current_active_user, get_current_superuser

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..models import Feedback
from ..database import get_db
from ..schemas import FeedbackResponse

router = APIRouter(prefix="/feedback", tags=["feedback"])

@router.post("/") #
async def create_feedback(
        feedback: schemas.Feedback,
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
    res = result.scalar_one()
    print(res)
    return res

