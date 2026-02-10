import { useState, useEffect } from "react";
import {
	UserPlus,
	Trash2,
	Mail,
	Building,
	Users as UsersIcon,
} from "lucide-react";
import { fetchEmployees, addEmployee, deleteEmployee } from "../api";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import ErrorMessage from "../components/ErrorMessage";

function Employees() {
	const [employees, setEmployees] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [showForm, setShowForm] = useState(false);
	const [formData, setFormData] = useState({
		emp_id: "",
		full_name: "",
		email: "",
		department: "",
	});
	const [formError, setFormError] = useState("");
	const [submitting, setSubmitting] = useState(false);

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

		if (
			!formData.emp_id.trim() ||
			!formData.full_name.trim() ||
			!formData.email.trim() ||
			!formData.department.trim()
		) {
			setFormError("All fields are required");
			return;
		}

		try {
			setSubmitting(true);
			await addEmployee(formData);
			setFormData({ emp_id: "", full_name: "", email: "", department: "" });
			setShowForm(false);
			loadEmployees();
		} catch (err) {
			if (err.response?.status === 400) {
				setFormError(err.response.data.detail || "Employee ID already exists");
			} else {
				setFormError("Failed to add employee. Please try again.");
			}
			console.error(err);
		} finally {
			setSubmitting(false);
		}
	};

	const handleDelete = async (empId) => {
		if (
			!window.confirm(
				"Are you sure you want to delete this employee? This will also delete all attendance records.",
			)
		) {
			return;
		}

		try {
			await deleteEmployee(empId);
			loadEmployees();
		} catch (err) {
			alert("Failed to delete employee. Please try again.");
			console.error(err);
		}
	};

	if (loading) {
		return <LoadingSpinner />;
	}

	return (
		<div className="page-container">
			<div className="page-header">
				<div>
					<h1>Employee Management</h1>
					<p>Manage your organization's employees</p>
				</div>
				<button
					className="btn btn-primary"
					onClick={() => setShowForm(!showForm)}
				>
					<UserPlus size={20} />
					{showForm ? "Cancel" : "Add Employee"}
				</button>
			</div>

			{error && <ErrorMessage message={error} />}

			{showForm && (
				<div className="card form-card">
					<h2>Add New Employee</h2>
					<form onSubmit={handleSubmit}>
						<div className="form-grid">
							<div className="form-group">
								<label htmlFor="emp_id">Employee ID *</label>
								<input
									type="text"
									id="emp_id"
									name="emp_id"
									value={formData.emp_id}
									onChange={handleInputChange}
									placeholder="e.g., EMP001"
									disabled={submitting}
									required
								/>
							</div>

							<div className="form-group">
								<label htmlFor="full_name">Full Name *</label>
								<input
									type="text"
									id="full_name"
									name="full_name"
									value={formData.full_name}
									onChange={handleInputChange}
									placeholder="Enter full name"
									disabled={submitting}
									required
								/>
							</div>

							<div className="form-group">
								<label htmlFor="email">Email Address *</label>
								<input
									type="email"
									id="email"
									name="email"
									value={formData.email}
									onChange={handleInputChange}
									placeholder="employee@company.com"
									disabled={submitting}
									required
								/>
							</div>

							<div className="form-group">
								<label htmlFor="department">Department *</label>
								<input
									type="text"
									id="department"
									name="department"
									value={formData.department}
									onChange={handleInputChange}
									placeholder="e.g., Engineering"
									disabled={submitting}
									required
								/>
							</div>
						</div>

						{formError && <ErrorMessage message={formError} />}

						<div className="form-actions">
							<button
								type="button"
								className="btn btn-secondary"
								onClick={() => {
									setShowForm(false);
									setFormData({
										emp_id: "",
										full_name: "",
										email: "",
										department: "",
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
								{submitting ? "Adding..." : "Add Employee"}
							</button>
						</div>
					</form>
				</div>
			)}

			{employees.length === 0 ? (
				<EmptyState
					icon={UsersIcon}
					title="No employees found"
					description="Start by adding your first employee using the button above."
				/>
			) : (
				<div className="card">
					<div className="table-container">
						<table className="table">
							<thead>
								<tr>
									<th>Employee ID</th>
									<th>Full Name</th>
									<th>Email</th>
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
										<td>
											<div className="table-email">
												<Mail size={16} />
												{emp.email}
											</div>
										</td>
										<td>
											<div className="table-department">
												<Building size={16} />
												{emp.department}
											</div>
										</td>
										<td>
											<button
												className="btn-icon btn-danger"
												onClick={() => handleDelete(emp.emp_id)}
												title="Delete employee"
											>
												<Trash2 size={18} />
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<div className="table-footer">
						Total Employees: {employees.length}
					</div>
				</div>
			)}
		</div>
	);
}

export default Employees;
