# backend/routers/users.py
from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta

from .. import models, auth
from ..database import user_collection, serialize_object

router = APIRouter()

@router.post("/register", response_model=models.UserPublic, status_code=status.HTTP_201_CREATED)
async def register_user(user: models.UserCreate):
    """
    Accepts username, email, and password.
    Hashes the password and saves the new user to the database.
    """
    # Check if user already exists
    existing_user = await user_collection.find_one({"user_email": user.user_email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    
    hashed_password = auth.get_password_hash(user.password)
    
    user_data = {
        "user_name": user.user_name,
        "user_email": user.user_email,
        "hashed_password": hashed_password
    }
    
    result = await user_collection.insert_one(user_data)
    created_user = await user_collection.find_one({"_id": result.inserted_id})
    
    return serialize_object(created_user)

@router.post("/login", response_model=models.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Accepts email (as username) and password.
    Verifies credentials and returns a JWT.
    """
    user = await user_collection.find_one({"user_email": form_data.username})
    
    if not user or not auth.verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = auth.create_access_token(data={"sub": user["user_email"]})
    
    return {"access_token": access_token, "token_type": "bearer"}