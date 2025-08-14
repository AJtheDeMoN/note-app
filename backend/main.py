# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from contextlib import asynccontextmanager
import pymongo

load_dotenv()

from .database import user_collection, note_collection
from .routers import users, notes

# Lifespan manager to run code on startup and shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Creating database indexes...")
    try:
        await user_collection.create_index("user_email", unique=True)
        await note_collection.create_index("owner_id")
        print("Database indexes created successfully.")
    except Exception as e:
        print(f"Error creating indexes: {e}")

    yield
    print("Application shutting down.")


app = FastAPI(
    title="Notes Taking App API",
    lifespan=lifespan  
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the routers
app.include_router(users.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(notes.router, prefix="/api/notes", tags=["Notes"])

@app.get("/api")
def read_root():
    return {"message": "Welcome to the Notes Taking App API"}