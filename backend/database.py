import os
import ssl
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_DETAILS = os.getenv("MONGODB_URI") # Your Atlas URI

# Create SSL context with more permissive settings for compatibility
ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

# Configure client with SSL context
client = AsyncIOMotorClient(
    MONGO_DETAILS,
    tlsCAFile=None,
    ssl=True,
    ssl_cert_reqs=ssl.CERT_NONE,
    serverSelectionTimeoutMS=30000,
    connectTimeoutMS=30000,
)

database = client.hrms_lite

employee_collection = database.get_collection("employees")
attendance_collection = database.get_collection("attendance")