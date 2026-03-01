from fastapi import APIRouter, Depends, HTTPException, status

from .. import schemas
from ..auth import get_current_active_user, get_current_superuser

router = APIRouter(prefix="/feedback", tags=["feedback"])

@router.post("/") #
async def create_feedback(
        current_user: schemas.User = Depends(get_current_active_user)
):
    return {"status": "created"}

@router.get("/{item_id}")
async def read_feedback(
        item_id: int,
        current_user: schemas.User = Depends(get_current_active_user)
):
    return {"status": item_id}

