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
		<nav className="sticky top-0 z-50 border-b border-(--border-subtle) bg-(--surface-panel) shadow-(--md-sys-elevation-1) backdrop-blur-xl">
			<div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 md:px-8">
				<div className="flex items-center">
					{/* Left: Logo and/or Title */}
					<Link to="/" className="group inline-flex items-center">
						<Text
							as="span"
							variant="brand"
							size="lg"
							className="text-(--text-primary) transition-colors duration-300 group-hover:text-(--accent)"
						>
							Pickleball Scoring System
						</Text>
					</Link>
				</div>

				<div className="hidden items-center gap-2 md:flex">
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
								className={`group rounded-full px-4 py-2 text-sm font-semibold tracking-wide transition-colors duration-200 ${
									active
										? "bg-(--accent-muted) text-(--md-sys-color-on-primary-container) shadow-(--md-sys-elevation-1)"
										: "text-(--text-muted) hover:bg-(--surface-hover)"
								}`}
							>
								<Text
									as="span"
									variant="nav"
									size="xs"
									className={`transition-colors duration-200 ${
										active
											? "text-(--md-sys-color-on-primary-container)"
											: "text-(--text-muted) group-hover:text-(--text-secondary)"
									}`}
								>
									{link.label}
								</Text>
							</NavLink>
						);
					})}
				</div>

				<button
					type="button"
					className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-(--border-subtle) text-(--text-secondary) transition-colors duration-200 hover:border-(--border-highlight) hover:text-(--accent) md:hidden"
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
			<div
				id="mobile-navigation"
				className={`md:hidden border-t border-(--border-subtle) bg-(--surface-panel) px-6 pb-4 transition-all duration-200 ${
					isMenuOpen ? "block" : "hidden"
				}`}
			>
				<div className="flex flex-col gap-2 py-4">
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
								className={`rounded-[18px] px-4 py-3 text-sm font-semibold ${
									active
										? "bg-(--accent-muted) text-(--md-sys-color-on-primary-container)"
										: "text-(--text-secondary) hover:bg-(--surface-hover)"
								}`}
							>
								{link.label}
							</NavLink>
						);
					})}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
