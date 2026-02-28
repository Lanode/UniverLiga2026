from fastapi import APIRouter, Depends, HTTPException, status

router = APIRouter(prefix="/feedback", tags=["feedback"])

@router.post("/") #
def create_feedback():
    return {"status": "created"}

@router.get("/{item_id}")
def read_feedback(item_id: int):
    return {"status": item_id}

