from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from database import employee_collection, attendance_collection
from models import EmployeeSchema, AttendanceSchema, employee_helper

app = FastAPI(title="HRMS Lite API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://hrm-system-lite.netlify.app",
        "http://localhost:5173",  # For local development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/employees", status_code=201)
async def add_employee(employee: EmployeeSchema = Body(...)):
    existing = await employee_collection.find_one({"emp_id": employee.emp_id})
    if existing:
        raise HTTPException(status_code=400, detail="Employee ID already exists")
    
    new_emp = await employee_collection.insert_one(employee.dict())
    return {"message": "Employee added successfully", "id": str(new_emp.inserted_id)}

@app.get("/employees")
async def get_employees():
    employees = []
    async for emp in employee_collection.find():
        employees.append(employee_helper(emp))
    return employees

@app.delete("/employees/{emp_id}")
async def delete_employee(emp_id: str):
    delete_result = await employee_collection.delete_one({"emp_id": emp_id})
    if delete_result.deleted_count == 1:
        await attendance_collection.delete_many({"employee_id": emp_id})
        return {"message": "Employee and records deleted"}
    raise HTTPException(status_code=404, detail="Employee not found")

@app.post("/attendance")
async def mark_attendance(attendance: AttendanceSchema = Body(...)):
    emp = await employee_collection.find_one({"emp_id": attendance.employee_id})
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    await attendance_collection.update_one(
        {"employee_id": attendance.employee_id, "date": attendance.date},
        {"$set": attendance.dict()},
        upsert=True
    )
    return {"message": "Attendance recorded"}

@app.get("/attendance/{emp_id}")
async def get_attendance(emp_id: str):
    records = []
    async for record in attendance_collection.find({"employee_id": emp_id}):
        records.append({
            "date": record["date"],
            "status": record["status"]
        })
    return records