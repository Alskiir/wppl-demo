import { ToggleSwitch } from "./components";
import { useState } from "react";

function App() {
	const [isChecked, setIsChecked] = useState(true);

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-900 transition-colors">
			<h1 className="text-2xl font-bold mb-6">WPPL Demo App</h1>
			<ToggleSwitch
				checked={isChecked}
				onChange={(checked) => {
					console.log(checked);
					setIsChecked(checked);
				}}
				label="Toggle Test"
			/>
		</div>
	);
}

export default App;
