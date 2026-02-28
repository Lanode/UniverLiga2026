from fastapi import APIRouter, Depends, HTTPException, status

router = APIRouter(prefix="/quastionare", tags=["quastionare"])

@router.post("/") #
def create_quastionare():
    return {"status": "created"}

@router.get("/{item_id}")
def read_quastionare(item_id: int):
    return {"status": item_id}

