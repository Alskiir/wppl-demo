import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Text } from "../Typography";
import { navRoutes } from "../../routes/appRoutes";

const normalizePath = (path: string) => {
	if (!path || path === "/") {
		return "/";
	}
	return path.length > 1 ? path.replace(/\/+$/, "") : path;
};

const isRouteActive = (paths: string[], currentPath: string) => {
	const normalizedCurrent = normalizePath(currentPath);

	return paths.some((targetPath) => {
		const normalizedTarget = normalizePath(targetPath);

		if (normalizedTarget === "/") {
			return normalizedCurrent === "/";
		}

		return (
			normalizedCurrent === normalizedTarget ||
			normalizedCurrent.startsWith(`${normalizedTarget}/`)
		);
	});
};

const Navbar: React.FC = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const location = useLocation();
	const currentPath = normalizePath(location.pathname);

	const handleLinkClick = () => {
		setIsMenuOpen(false);
	};

	return (
		<nav className="flex justify-center border-b border-(--border-strong) bg-(--surface-panel)">
			<div className="w-full max-w-7xl px-6 md:px-8">
				<div className="flex h-20 items-center justify-between">
					{/* Left: Logo and/or Title */}
					<div className="flex items-center">
						<Link to="/" className="group inline-flex items-center">
							<Text
								as="span"
								variant="brand"
								size="lg"
								className="transition-colors duration-300 group-hover:text-(--accent)"
							>
								WPPL Scoring System Demo
							</Text>
						</Link>
					</div>

					{/* Right: Nav Links */}
					<div className="hidden md:flex items-center gap-6">
						{navRoutes.map((link) => {
							const active = isRouteActive(
								link.activePaths,
								currentPath
							);
							return (
								<NavLink
									key={link.key}
									to={link.path}
									onClick={handleLinkClick}
									aria-current={active ? "page" : undefined}
									end={link.path === "/"}
									className={`group rounded-full border px-4 py-2 transition-colors duration-200 ${
										active
											? "border-(--border-highlight) bg-(--surface-raised)"
											: "border-transparent hover:border-(--border-highlight) hover:bg-(--surface-card)"
									}`}
								>
									<Text
										as="span"
										variant="nav"
										size="xs"
										className={`transition-colors duration-200 ${
											active
												? "text-(--text-secondary)"
												: "group-hover:text-(--text-secondary)"
										}`}
									>
										{link.label}
									</Text>
								</NavLink>
							);
						})}
					</div>

					{/* Mobile menu toggle */}
					<button
						type="button"
						className="inline-flex items-center justify-center rounded-xl border border-(--border-subtle) bg-(--surface-card) p-2 text-(--text-secondary) transition-colors duration-200 hover:border-(--border-highlight) hover:text-(--accent) md:hidden"
						aria-controls="mobile-navigation"
						aria-expanded={isMenuOpen}
						onClick={() => setIsMenuOpen((prev) => !prev)}
					>
						<span className="sr-only">Toggle navigation</span>
						<svg
							className="h-6 w-6"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							aria-hidden="true"
						>
							{isMenuOpen ? (
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.5}
									d="M6 18L18 6M6 6l12 12"
								/>
							) : (
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.5}
									d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
								/>
							)}
						</svg>
					</button>
				</div>

				{/* Mobile nav links */}
				<div
					id="mobile-navigation"
					className={`md:hidden border-t border-(--border-subtle) bg-(--surface-panel) px-2 pb-4 pt-3 ${
						isMenuOpen ? "block" : "hidden"
					}`}
				>
					<div className="flex flex-col gap-2">
						{navRoutes.map((link) => {
							const active = isRouteActive(
								link.activePaths,
								currentPath
							);
							return (
								<NavLink
									key={link.key}
									to={link.path}
									onClick={handleLinkClick}
									aria-current={active ? "page" : undefined}
									end={link.path === "/"}
									className={`group rounded-xl px-3 py-2 transition-colors duration-200 ${
										active
											? "bg-(--surface-raised)"
											: "hover:bg-(--surface-card)"
									}`}
								>
									<Text
										as="span"
										variant="nav"
										size="sm"
										className={`transition-colors duration-200 ${
											active
												? "text-(--text-secondary)"
												: "group-hover:text-(--text-secondary)"
										}`}
									>
										{link.label}
									</Text>
								</NavLink>
							);
						})}
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
