import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Text } from "../Typography";
import { navRoutes } from "../../routes/appRoutes";

const Navbar: React.FC = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const location = useLocation();

	const normalizePath = (path: string) =>
		path.length > 1 ? path.replace(/\/+$/, "") : path;
	const currentPath = normalizePath(location.pathname);

	const isRouteActive = (targetPath: string) => {
		const normalizedTarget = normalizePath(targetPath);
		if (normalizedTarget === "/home" && currentPath === "/") {
			return true;
		}
		if (normalizedTarget === "/") {
			return currentPath === "/";
		}
		return (
			currentPath === normalizedTarget ||
			currentPath.startsWith(`${normalizedTarget}/`)
		);
	};

	const handleLinkClick = () => {
		setIsMenuOpen(false);
	};

	return (
		<nav className="flex justify-center bg-linear-to-r from-neutral-950/95 via-neutral-900/95 to-neutral-950/95 border-b border-neutral-800/60 backdrop-blur shadow-[0_8px_30px_rgba(15,23,42,0.35)]">
			<div className="w-full max-w-7xl px-6 md:px-8">
				<div className="flex h-20 items-center justify-between">
					{/* Left: Logo and/or Title */}
					<div className="flex items-center">
						<Link to="/" className="group inline-flex items-center">
							<Text
								as="span"
								variant="brand"
								size="lg"
								className="drop-shadow-sm transition-colors duration-300 group-hover:text-sky-300"
							>
								WPPL Scoring System Demo
							</Text>
						</Link>
					</div>

					{/* Right: Nav Links */}
					<div className="hidden md:flex items-center gap-6">
						{navRoutes.map((link) => {
							const isActive = isRouteActive(link.path);
							return (
								<Link
									key={link.key}
									to={link.path}
									onClick={handleLinkClick}
									aria-current={isActive ? "page" : undefined}
									className="group relative overflow-hidden rounded-full px-4 py-2 transition-all duration-200"
								>
									<span
										aria-hidden="true"
										className="pointer-events-none absolute inset-0 scale-0 bg-sky-500/20 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100"
									/>
									<Text
										as="span"
										variant="nav"
										size="xs"
										className={`relative z-10 transition-colors duration-200 group-hover:text-neutral-50 ${
											isActive ? "text-neutral-50" : ""
										}`}
									>
										{link.label}
									</Text>
									<span
										aria-hidden="true"
										className={`pointer-events-none absolute inset-x-3 bottom-1 h-px bg-sky-300/70 transition-transform duration-300 group-hover:scale-x-100 ${
											isActive
												? "scale-x-100"
												: "scale-x-0"
										}`}
									/>
								</Link>
							);
						})}
					</div>

					{/* Mobile menu toggle */}
					<button
						type="button"
						className="inline-flex items-center justify-center rounded-xl border border-neutral-700/50 p-2 text-neutral-200 shadow-sm transition-all duration-200 hover:border-sky-400/60 hover:text-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-neutral-900 md:hidden"
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
					className={`md:hidden border-t border-neutral-800/60 bg-neutral-950/90 px-2 pb-4 pt-3 backdrop-blur ${
						isMenuOpen ? "block" : "hidden"
					}`}
				>
					<div className="flex flex-col gap-2">
						{navRoutes.map((link) => {
							const isActive = isRouteActive(link.path);
							return (
								<Link
									key={link.key}
									to={link.path}
									onClick={handleLinkClick}
									aria-current={isActive ? "page" : undefined}
									className={`group rounded-lg px-3 py-2 transition-colors duration-200 hover:bg-sky-500/15 ${
										isActive ? "bg-sky-500/15" : ""
									}`}
								>
									<Text
										as="span"
										variant="nav"
										size="sm"
										className={`transition-colors duration-200 group-hover:text-neutral-50 ${
											isActive ? "text-neutral-50" : ""
										}`}
									>
										{link.label}
									</Text>
								</Link>
							);
						})}
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
