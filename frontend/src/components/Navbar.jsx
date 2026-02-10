import { Link, useLocation } from "react-router-dom";
import { Users, CalendarCheck } from "lucide-react";

function Navbar() {
	const location = useLocation();

	const isActive = (path) => location.pathname === path;

	return (
		<nav className="navbar">
			<div className="nav-container">
				<Link
					to="/"
					className="nav-brand"
				>
					<Users size={24} />
					<span>HRMS Lite</span>
				</Link>

				<div className="nav-links">
					<Link
						to="/"
						className={`nav-link ${isActive("/") ? "active" : ""}`}
					>
						<Users size={20} />
						<span>Employees</span>
					</Link>
					<Link
						to="/attendance"
						className={`nav-link ${isActive("/attendance") ? "active" : ""}`}
					>
						<CalendarCheck size={20} />
						<span>Attendance</span>
					</Link>
				</div>
			</div>
		</nav>
	);
}

export default Navbar;
