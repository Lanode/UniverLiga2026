from fastapi import APIRouter, Depends, HTTPException, status

from .. import schemas
from ..auth import get_current_active_user, get_current_superuser


router = APIRouter(prefix="/quastionare", tags=["quastionare"])

@router.post("/") #
def create_quastionare(
        current_user: schemas.User = Depends(get_current_active_user)
):
    return {"status": "created"}

@router.get("/{item_id}")
def read_quastionare(
        item_id: int,
        current_user: schemas.User = Depends(get_current_active_user)
):
    return {"status": item_id}

