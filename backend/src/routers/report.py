from fastapi import APIRouter, Depends, HTTPException, status

router = APIRouter(prefix="/report", tags=["report"])

@router.post("/") #
def create_report():
    return {"status": "created"}

@router.get("/{item_id}")
def read_report(item_id: int):
    return {"status": item_id}

