from fastapi import APIRouter, Depends, HTTPException, status

from .. import schemas
from ..auth import get_current_active_user, get_current_superuser

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..models import Feedback
from ..database import get_db
from ..schemas import FeedbackResponse
from ..models.feedback import FeedbackSubcategory, feedback_subcategory_association

router = APIRouter(prefix="/feedback", tags=["feedback"])

@router.post("/") #
async def create_feedback(
        feedback: schemas.Feedback,
        current_user: schemas.User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_db)
):
    feedback_new = Feedback(
        feedback_type= feedback.feedback_type,
        comment = feedback.comment,
        user_id = current_user.id,
        user_to_id=feedback.user_to_id,
        allow_feedback=False
    )
    db.add(feedback_new)
    await db.commit()
    await db.refresh(feedback_new)

    for sub in feedback.subcategories:
        await db.execute(feedback_subcategory_association.insert().values((feedback_new.id,sub.id)))
    return feedback_new

@router.get("/")
async def get_feedback(
        current_user: schemas.User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(FeedbackSubcategory).where(FeedbackSubcategory.department == current_user.role))
    return result.scalars().all()

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