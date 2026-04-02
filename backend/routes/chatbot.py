from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_chatbot():
    return {"message": "chatbot endpoint working"}