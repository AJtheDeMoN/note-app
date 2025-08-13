# backend/routers/notes.py
import uuid
from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status

from .. import models, auth
from ..database import note_collection, serialize_note

router = APIRouter()

# Dependency for all note routes
CurrentUser = Depends(auth.get_current_user)

@router.post("/", response_model=models.NotePublic, status_code=status.HTTP_201_CREATED)
async def create_note(note: models.NoteCreate, current_user: dict = CurrentUser):
    """Create a new note. The user ID comes from the decoded JWT."""
    note_data = note.dict()
    note_data.update({
        "note_id": str(uuid.uuid4()),
        "owner_id": current_user["user_id"],
        "created_on": datetime.utcnow(),
        "last_update": datetime.utcnow()
    })
    
    await note_collection.insert_one(note_data)
    return note_data

@router.get("/", response_model=List[models.NotePublic])
async def get_all_notes(current_user: dict = CurrentUser):
    """Get all notes for the logged-in user."""
    notes = []
    cursor = note_collection.find({"owner_id": current_user["user_id"]})
    async for note in cursor:
        notes.append(note)
    return notes

@router.get("/{note_id}", response_model=models.NotePublic)
async def get_note(note_id: str, current_user: dict = CurrentUser):
    """Get a single note by its ID, ensuring it belongs to the user."""
    note = await note_collection.find_one({"note_id": note_id})
    if not note or note["owner_id"] != current_user["user_id"]:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    return note

@router.put("/{note_id}", response_model=models.NotePublic)
async def update_note(note_id: str, note_update: models.NoteUpdate, current_user: dict = CurrentUser):
    """Update an existing note."""
    existing_note = await note_collection.find_one({"note_id": note_id})
    if not existing_note or existing_note["owner_id"] != current_user["user_id"]:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")

    update_data = note_update.dict()
    update_data["last_update"] = datetime.utcnow()
    
    await note_collection.update_one({"note_id": note_id}, {"$set": update_data})
    
    updated_note = await note_collection.find_one({"note_id": note_id})
    return updated_note

@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_note(note_id: str, current_user: dict = CurrentUser):
    """Delete a note."""
    existing_note = await note_collection.find_one({"note_id": note_id})
    if not existing_note or existing_note["owner_id"] != current_user["user_id"]:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")

    await note_collection.delete_one({"note_id": note_id})
    return