from fastapi import APIRouter
from pydantic import BaseModel
from db import get_connection
from ai_client import get_ai_client
import os

router = APIRouter()

class ChatRequest(BaseModel):
    question: str

@router.post("/")
def ask_chatbot(data: ChatRequest):
    return {"message": "chatbot coming soon"}