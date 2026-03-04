from fastapi import APIRouter, Depends, HTTPException, status

from .. import schemas
from ..auth import get_current_active_user, get_current_superuser, get_user_with_subordinates

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete, update
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


# Feedback Subcategories Endpoints
@router.get("/subcategories/", response_model=list[schemas.FeedbackSubcategory])
async def get_feedback_subcategories(
    current_user: schemas.User = Depends(get_user_with_subordinates),
    db: AsyncSession = Depends(get_db)
):
    """Get all feedback subcategories (only for users with subordinates)."""
    result = await db.execute(select(FeedbackSubcategory))
    subcategories = result.scalars().all()
    return subcategories


@router.post("/subcategories/", response_model=schemas.FeedbackSubcategory)
async def create_feedback_subcategory(
    subcategory: schemas.FeedbackSubcategoryCreate,
    current_user: schemas.User = Depends(get_user_with_subordinates),
    db: AsyncSession = Depends(get_db)
):
    """Create a new feedback subcategory (only for users with subordinates)."""
    # Check if subcategory with same text already exists
    result = await db.execute(
        select(FeedbackSubcategory).where(FeedbackSubcategory.text == subcategory.text)
    )
    existing = result.scalar_one_or_none()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Subcategory with this text already exists"
        )
    
    db_subcategory = FeedbackSubcategory(
        text=subcategory.text,
        feedback_type_relation=subcategory.feedback_type_relation,
        department=subcategory.department
    )
    
    db.add(db_subcategory)
    await db.commit()
    await db.refresh(db_subcategory)
    return db_subcategory


@router.get("/subcategories/{subcategory_id}", response_model=schemas.FeedbackSubcategory)
async def get_feedback_subcategory(
    subcategory_id: int,
    current_user: schemas.User = Depends(get_user_with_subordinates),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific feedback subcategory by ID (only for users with subordinates)."""
    result = await db.execute(
        select(FeedbackSubcategory).where(FeedbackSubcategory.id == subcategory_id)
    )
    subcategory = result.scalar_one_or_none()
    
    if subcategory is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subcategory not found"
        )
    
    return subcategory


@router.put("/subcategories/{subcategory_id}", response_model=schemas.FeedbackSubcategory)
async def update_feedback_subcategory(
    subcategory_id: int,
    subcategory_update: schemas.FeedbackSubcategoryUpdate,
    current_user: schemas.User = Depends(get_user_with_subordinates),
    db: AsyncSession = Depends(get_db)
):
    """Update a feedback subcategory (only for users with subordinates)."""
    # Get subcategory from database
    result = await db.execute(
        select(FeedbackSubcategory).where(FeedbackSubcategory.id == subcategory_id)
    )
    db_subcategory = result.scalar_one_or_none()
    
    if db_subcategory is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subcategory not found"
        )
    
    # Update fields
    update_data = subcategory_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_subcategory, field, value)
    
    await db.commit()
    await db.refresh(db_subcategory)
    return db_subcategory


@router.delete("/subcategories/{subcategory_id}")
async def delete_feedback_subcategory(
    subcategory_id: int,
    current_user: schemas.User = Depends(get_user_with_subordinates),
    db: AsyncSession = Depends(get_db)
):
    """Delete a feedback subcategory (only for users with subordinates)."""
    # Get subcategory from database
    result = await db.execute(
        select(FeedbackSubcategory).where(FeedbackSubcategory.id == subcategory_id)
    )
    db_subcategory = result.scalar_one_or_none()
    
    if db_subcategory is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subcategory not found"
        )
    
    # Check if subcategory is used in any feedback
    result = await db.execute(
        select(feedback_subcategory_association).where(
            feedback_subcategory_association.c.subcategory_id == subcategory_id
        )
    )
    usage = result.first()
    
    if usage:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete subcategory that is used in feedback"
        )
    
    await db.delete(db_subcategory)
    await db.commit()
    
    return {"message": "Subcategory deleted successfully"}
