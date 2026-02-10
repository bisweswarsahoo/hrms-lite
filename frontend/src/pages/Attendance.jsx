import { useState, useEffect } from "react";
import { CalendarCheck, Check, X, Eye } from "lucide-react";
import {
	fetchEmployees,
	markAttendance,
	getAttendanceByEmployee,
} from "../api";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import ErrorMessage from "../components/ErrorMessage";

function Attendance() {
	const [employees, setEmployees] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [showMarkForm, setShowMarkForm] = useState(false);
	const [formData, setFormData] = useState({
		employee_id: "",
		date: new Date().toISOString().split("T")[0],
		status: "Present",
	});
	const [formError, setFormError] = useState("");
	const [submitting, setSubmitting] = useState(false);

	// View attendance
	const [viewingAttendance, setViewingAttendance] = useState(false);
	const [selectedEmployee, setSelectedEmployee] = useState(null);
	const [attendanceRecords, setAttendanceRecords] = useState([]);
	const [loadingRecords, setLoadingRecords] = useState(false);

	useEffect(() => {
		loadEmployees();
	}, []);

	const loadEmployees = async () => {
		try {
			setLoading(true);
			setError("");
			const response = await fetchEmployees();
			setEmployees(response.data);
		} catch (err) {
			setError("Failed to load employees. Please try again.");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const handleInputChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
		setFormError("");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setFormError("");

		if (!formData.employee_id) {
			setFormError("Please select an employee");
			return;
		}

		try {
			setSubmitting(true);
			await markAttendance(formData);
			setFormData({
				employee_id: "",
				date: new Date().toISOString().split("T")[0],
				status: "Present",
			});
			setShowMarkForm(false);
			alert("Attendance marked successfully!");
		} catch (err) {
			setFormError(
				err.response?.data?.detail ||
					"Failed to mark attendance. Please try again.",
			);
			console.error(err);
		} finally {
			setSubmitting(false);
		}
	};

	const handleViewAttendance = async (employee) => {
		setSelectedEmployee(employee);
		setViewingAttendance(true);
		setLoadingRecords(true);

		try {
			const response = await getAttendanceByEmployee(employee.emp_id);
			const sorted = response.data.sort(
				(a, b) => new Date(b.date) - new Date(a.date),
			);
			setAttendanceRecords(sorted);
		} catch (err) {
			console.error(err);
			setAttendanceRecords([]);
		} finally {
			setLoadingRecords(false);
		}
	};

	const closeViewAttendance = () => {
		setViewingAttendance(false);
		setSelectedEmployee(null);
		setAttendanceRecords([]);
	};

	const getTotalPresentDays = () => {
		return attendanceRecords.filter((r) => r.status === "Present").length;
	};

	if (loading) {
		return <LoadingSpinner />;
	}

	if (viewingAttendance) {
		return (
			<div className="page-container">
				<div className="page-header">
					<div>
						<h1>Attendance Records</h1>
						<p>
							{selectedEmployee?.full_name} ({selectedEmployee?.emp_id})
						</p>
					</div>
					<button
						className="btn btn-secondary"
						onClick={closeViewAttendance}
					>
						Back to Attendance
					</button>
				</div>

				{loadingRecords ? (
					<LoadingSpinner />
				) : attendanceRecords.length === 0 ? (
					<EmptyState
						icon={CalendarCheck}
						title="No attendance records"
						description="No attendance has been marked for this employee yet."
					/>
				) : (
					<>
						<div className="stats-card">
							<div className="stat-item">
								<span className="stat-label">Total Days Marked</span>
								<span className="stat-value">{attendanceRecords.length}</span>
							</div>
							<div className="stat-item">
								<span className="stat-label">Present</span>
								<span className="stat-value stat-success">
									{getTotalPresentDays()}
								</span>
							</div>
							<div className="stat-item">
								<span className="stat-label">Absent</span>
								<span className="stat-value stat-danger">
									{attendanceRecords.length - getTotalPresentDays()}
								</span>
							</div>
						</div>

						<div className="card">
							<div className="table-container">
								<table className="table">
									<thead>
										<tr>
											<th>Date</th>
											<th>Status</th>
										</tr>
									</thead>
									<tbody>
										{attendanceRecords.map((record, index) => (
											<tr key={index}>
												<td>
													{new Date(record.date).toLocaleDateString("en-US", {
														year: "numeric",
														month: "long",
														day: "numeric",
													})}
												</td>
												<td>
													<span
														className={`status-badge ${record.status === "Present" ? "status-present" : "status-absent"}`}
													>
														{record.status === "Present" ? (
															<Check size={16} />
														) : (
															<X size={16} />
														)}
														{record.status}
													</span>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</>
				)}
			</div>
		);
	}

	return (
		<div className="page-container">
			<div className="page-header">
				<div>
					<h1>Attendance Management</h1>
					<p>Mark and view employee attendance records</p>
				</div>
				<button
					className="btn btn-primary"
					onClick={() => setShowMarkForm(!showMarkForm)}
					disabled={employees.length === 0}
				>
					<CalendarCheck size={20} />
					{showMarkForm ? "Cancel" : "Mark Attendance"}
				</button>
			</div>

			{error && <ErrorMessage message={error} />}

			{showMarkForm && (
				<div className="card form-card">
					<h2>Mark Attendance</h2>
					<form onSubmit={handleSubmit}>
						<div className="form-grid">
							<div className="form-group">
								<label htmlFor="employee_id">Select Employee *</label>
								<select
									id="employee_id"
									name="employee_id"
									value={formData.employee_id}
									onChange={handleInputChange}
									disabled={submitting}
									required
								>
									<option value="">-- Select Employee --</option>
									{employees.map((emp) => (
										<option
											key={emp.id}
											value={emp.emp_id}
										>
											{emp.emp_id} - {emp.full_name}
										</option>
									))}
								</select>
							</div>

							<div className="form-group">
								<label htmlFor="date">Date *</label>
								<input
									type="date"
									id="date"
									name="date"
									value={formData.date}
									onChange={handleInputChange}
									disabled={submitting}
									required
								/>
							</div>

							<div className="form-group">
								<label htmlFor="status">Status *</label>
								<select
									id="status"
									name="status"
									value={formData.status}
									onChange={handleInputChange}
									disabled={submitting}
									required
								>
									<option value="Present">Present</option>
									<option value="Absent">Absent</option>
								</select>
							</div>
						</div>

						{formError && <ErrorMessage message={formError} />}

						<div className="form-actions">
							<button
								type="button"
								className="btn btn-secondary"
								onClick={() => {
									setShowMarkForm(false);
									setFormData({
										employee_id: "",
										date: new Date().toISOString().split("T")[0],
										status: "Present",
									});
									setFormError("");
								}}
								disabled={submitting}
							>
								Cancel
							</button>
							<button
								type="submit"
								className="btn btn-primary"
								disabled={submitting}
							>
								{submitting ? "Marking..." : "Mark Attendance"}
							</button>
						</div>
					</form>
				</div>
			)}

			{employees.length === 0 ? (
				<EmptyState
					icon={CalendarCheck}
					title="No employees found"
					description="Please add employees first to mark attendance."
				/>
			) : (
				<div className="card">
					<h2>Employee List</h2>
					<p className="card-subtitle">
						Click on an employee to view their attendance records
					</p>
					<div className="table-container">
						<table className="table">
							<thead>
								<tr>
									<th>Employee ID</th>
									<th>Full Name</th>
									<th>Department</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{employees.map((emp) => (
									<tr key={emp.id}>
										<td>
											<span className="badge">{emp.emp_id}</span>
										</td>
										<td>{emp.full_name}</td>
										<td>{emp.department}</td>
										<td>
											<button
												className="btn-icon btn-primary"
												onClick={() => handleViewAttendance(emp)}
												title="View attendance records"
											>
												<Eye size={18} />
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	);
}

export default Attendance;
