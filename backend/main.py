from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import tickets, chatbot, auth, graphs, dropdown, upload, chat_history, workspace

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
app.include_router(dropdown.router, prefix="/api/dropdown", tags=["dropdown"])
app.include_router(upload.router, prefix="/api/upload", tags=["upload"])
app.include_router(chat_history.router, prefix="/api/chat", tags=["chat"])
app.include_router(workspace.router, prefix="/api/workspace", tags=["workspace"])

@app.get("/")
def root():
    return {"message": "API is running"}