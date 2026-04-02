from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_tickets():
    return {"message": "tickets endpoint working"}