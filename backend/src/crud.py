from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional

from . import models, schemas
from .utils import get_password_hash


# User CRUD operations
async def get_user(db: AsyncSession, user_id: int) -> Optional[models.User]:
    """Get a user by ID."""
    result = await db.execute(
        select(models.User).where(models.User.id == user_id)
    )
    return result.scalar_one_or_none()


async def get_user_by_email(db: AsyncSession, email: str) -> Optional[models.User]:
    """Get a user by email."""
    result = await db.execute(
        select(models.User).where(models.User.email == email)
    )
    return result.scalar_one_or_none()


async def get_user_by_username(db: AsyncSession, username: str) -> Optional[models.User]:
    """Get a user by username."""
    result = await db.execute(
        select(models.User).where(models.User.username == username)
    )
    return result.scalar_one_or_none()


async def get_users(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[models.User]:
    """Get a list of users with pagination."""
    result = await db.execute(
        select(models.User).offset(skip).limit(limit)
    )
    return result.scalars().all()


async def create_user(db: AsyncSession, user: schemas.UserCreate) -> models.User:
    """Create a new user."""
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        hashed_password=hashed_password
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user


async def update_user(
    db: AsyncSession, 
    user_id: int, 
    user_update: schemas.UserUpdate
) -> Optional[models.User]:
    """Update a user."""
    db_user = await get_user(db, user_id)
    if not db_user:
        return None
    
    update_data = user_update.model_dump(exclude_unset=True)
    
    # Handle password update separately
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
    
    for field, value in update_data.items():
        setattr(db_user, field, value)
    
    await db.commit()
    await db.refresh(db_user)
    return db_user


async def delete_user(db: AsyncSession, user_id: int) -> bool:
    """Delete a user."""
    db_user = await get_user(db, user_id)
    if not db_user:
        return False
    
    await db.delete(db_user)
    await db.commit()
    return True


# Item CRUD operations
async def get_items(
    db: AsyncSession, 
    skip: int = 0, 
    limit: int = 100,
    owner_id: Optional[int] = None
) -> List[models.Item]:
    """Get a list of items with optional filtering by owner."""
    query = select(models.Item)
    if owner_id is not None:
        query = query.where(models.Item.owner_id == owner_id)
    
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


async def get_item(db: AsyncSession, item_id: int) -> Optional[models.Item]:
    """Get an item by ID."""
    result = await db.execute(
        select(models.Item).where(models.Item.id == item_id)
    )
    return result.scalar_one_or_none()


async def create_item(
    db: AsyncSession, 
    item: schemas.ItemCreate, 
    owner_id: int
) -> models.Item:
    """Create a new item for a user."""
    db_item = models.Item(**item.model_dump(), owner_id=owner_id)
    db.add(db_item)
    await db.commit()
    await db.refresh(db_item)
    return db_item


async def update_item(
    db: AsyncSession, 
    item_id: int, 
    item_update: schemas.ItemUpdate
) -> Optional[models.Item]:
    """Update an item."""
    db_item = await get_item(db, item_id)
    if not db_item:
        return None
    
    update_data = item_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_item, field, value)
    
    await db.commit()
    await db.refresh(db_item)
    return db_item


async def delete_item(db: AsyncSession, item_id: int) -> bool:
    """Delete an item."""
    db_item = await get_item(db, item_id)
    if not db_item:
        return False
    
    await db.delete(db_item)
    await db.commit()
    return True