from fastapi import APIRouter, Depends, HTTPException, status

from .. import schemas
from ..auth import get_current_active_user, get_current_superuser


router = APIRouter(prefix="/report", tags=["report"])

@router.post("/") #
def create_report(
        current_user: schemas.User = Depends(get_current_active_user)
):
    return {"status": "created"}

@router.get("/{item_id}")
def read_report(
        item_id: int,
        current_user: schemas.User = Depends(get_current_active_user)
):
    return {"status": item_id}

