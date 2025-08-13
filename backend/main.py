# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables from .env file BEFORE other imports
load_dotenv()

from .routers import users, notes

app = FastAPI(title="Notes Taking App API")

# CORS (Cross-Origin Resource Sharing)
# This allows your Next.js frontend (running on a different port) to talk to this API.
origins = [
    "http://localhost:3000",  # The default Next.js dev server
    "http://127.0.0.1:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the routers
app.include_router(users.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(notes.router, prefix="/api/notes", tags=["Notes"])

@app.get("/api")
def read_root():
    return {"message": "Welcome to the Notes Taking App API"}