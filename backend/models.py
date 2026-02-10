from pydantic import BaseModel, EmailStr, Field

class EmployeeSchema(BaseModel):
    emp_id: str = Field(..., unique=True)
    full_name: str
    email: EmailStr
    department: str

class AttendanceSchema(BaseModel):
    employee_id: str
    date: str  
    status: str 

def employee_helper(employee) -> dict:
    return {
        "id": str(employee["_id"]),
        "emp_id": employee["emp_id"],
        "full_name": employee["full_name"],
        "email": employee["email"],
        "department": employee["department"],
    }