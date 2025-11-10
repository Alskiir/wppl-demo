import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import { appRoutes } from "./routes/appRoutes";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<App />}>
					{appRoutes.map(({ key, path, element }) => (
						<Route key={key} path={path} element={element} />
					))}
					{appRoutes
						.filter(({ index }) => index)
						.map(({ key, element }) => (
							<Route
								key={`${key}-index`}
								index
								element={element}
							/>
						))}
				</Route>
			</Routes>
		</BrowserRouter>
	</StrictMode>
);
