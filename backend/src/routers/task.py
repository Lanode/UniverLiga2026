from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession

from .. import schemas
from ..auth import get_current_active_user, get_current_superuser
from ..database import get_db
from ..models.task import TaskLink, Task
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
        select(TaskLink.task_id).where((TaskLink.user_id == current_user_id))
    )
    if task_id not in result_all_task_user.scalars().all():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

    result = await db.execute(
        select(User).join(TaskLink).filter(TaskLink.user_id == User.id).where((TaskLink.task_id == task_id)&(TaskLink.user_id != current_user_id))
    )
    users = result.scalars().all()
    return users

@router.post("/create", response_model=schemas.Task)
async def create_task(
        db: AsyncSession = Depends(get_db)
):
    task = Task()
    db.add(task)
    await db.commit()
    await db.refresh(task)
    return task

@router.post("/create_link", response_model=schemas.TaskLink)
async def create_task_link(
        link: schemas.TaskLink,
        db: AsyncSession = Depends(get_db)
):
    result_tasks = await db.execute(select(Task.id).where(Task.id == link.task_id))
    if link.task_id not in result_tasks.scalars().all():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

    result_user = await db.execute(select(User.id).where(User.id == link.user_id))
    if link.user_id not in result_user.scalars().all():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    link = TaskLink(
        task_id = link.task_id,
        user_id = link.user_id
    )
    db.add(link)
    await db.commit()
    await db.refresh(link)
    return link