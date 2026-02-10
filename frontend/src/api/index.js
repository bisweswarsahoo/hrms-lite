import axios from "axios";

const API = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

export const fetchEmployees = () => API.get("/employees");
export const addEmployee = (data) => API.post("/employees", data);
export const deleteEmployee = (id) => API.delete(`/employees/${id}`);
export const markAttendance = (data) => API.post("/attendance", data);
export const getAttendanceByEmployee = (id) => API.get(`/attendance/${id}`);
