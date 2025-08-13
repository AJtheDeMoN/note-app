# backend/models.py
from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime
import uuid

# ==================
# User Models
# ==================
class UserBase(BaseModel):
    user_name: str
    user_email: EmailStr

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    user_id: str
    hashed_password: str

# Model for returning user info to client (without password)
class UserPublic(BaseModel):
    user_id: str
    user_name: str
    user_email: EmailStr
    
# ==================
# Note Models
# ==================
class NoteBase(BaseModel):
    note_title: str
    note_content: str

class NoteCreate(NoteBase):
    pass

class NoteUpdate(NoteBase):
    pass

class NotePublic(NoteBase):
    note_id: str
    owner_id: str
    created_on: datetime
    last_update: datetime

# ==================
# Token Models
# ==================
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_email: Optional[str] = None