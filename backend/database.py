import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_DETAILS = os.getenv("MONGODB_URI") # Your Atlas URI

# Configure client with proper SSL/TLS settings for MongoDB Atlas
client = AsyncIOMotorClient(
    MONGO_DETAILS,
    tls=True,
    tlsAllowInvalidCertificates=False,
    serverSelectionTimeoutMS=5000,
    connectTimeoutMS=10000,
)

database = client.hrms_lite

employee_collection = database.get_collection("employees")
attendance_collection = database.get_collection("attendance")