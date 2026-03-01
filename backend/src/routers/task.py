from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .. import schemas
from ..auth import get_current_active_user, get_current_superuser
from ..database import get_db
from ..models.task import TaskLink
from ..models.user import User
from ..utils import get_password_hash

router = APIRouter(prefix="/task", tags=["tasks"])

@router.get("/{task_id}/users", response_model=List[schemas.User])
async def read_task_users(
    task_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_active_user)
):
    current_user_id = current_user.id
    result_all_task_user = await db.execute(
        select(TaskLink.task_id).where(TaskLink.user_id == current_user_id)
    )
    if task_id not in result_all_task_user.scalars().all():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

    result = await db.execute(
        select(User).join(TaskLink).filter(TaskLink.user_id == User.id).where(TaskLink.task_id == task_id)
    )
    users = result.scalars().all()
    return users
