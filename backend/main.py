from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import tickets, chatbot, auth, graphs

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tickets.router, prefix="/api/tickets", tags=["tickets"])
app.include_router(chatbot.router, prefix="/api/chatbot", tags=["chatbot"])
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(graphs.router, prefix="/api/graphs", tags=["graphs"])

@app.get("/")
def root():
    return {"message": "API is running"}