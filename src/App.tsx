import { Outlet } from "react-router-dom";
import { Navbar } from "./components";

function App() {
	return (
		<div className="flex min-h-screen flex-col bg-(--surface-backdrop) text-(--text-primary)">
			<Navbar />
			<div className="grow">
				<Outlet />
			</div>
		</div>
	);
}

export default App;
