import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import "./App.css";

function App() {
	return (
		<Router>
			<div className="app">
				<Navbar />
				<main className="main-content">
					<Routes>
						<Route
							path="/"
							element={<Employees />}
						/>
						<Route
							path="/attendance"
							element={<Attendance />}
						/>
					</Routes>
				</main>
			</div>
		</Router>
	);
}

export default App;
