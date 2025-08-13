# backend/database.py
import os
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

# Load environment variables (best practice for secrets)
MONGO_DETAILS = os.getenv("MONGO_DETAILS")

client = AsyncIOMotorClient(MONGO_DETAILS)

# Get a handle to the database and collections
database = client.notes_app
user_collection = database.get_collection("users")
note_collection = database.get_collection("notes")

# Helper function to parse MongoDB's BSON ObjectId to a string
def serialize_object(obj):
    if isinstance(obj, dict):
        # Convert ObjectId to string for the '_id' field
        if "_id" in obj and isinstance(obj["_id"], ObjectId):
            obj["user_id"] = str(obj["_id"])
            del obj["_id"] # remove original _id field
        return obj
    return None

def serialize_note(note):
    if isinstance(note, dict):
        if "_id" in note and isinstance(note["_id"], ObjectId):
            # No need to change the primary key name for notes
            note["note_id"] = str(note["_id"])
            del obj["_id"]
        return note
    return None