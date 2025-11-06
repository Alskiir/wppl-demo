import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const navLinks = [
		{ name: "Home", path: "/home" },
		{ name: "Scores", path: "/scores" },
		{ name: "Standings", path: "/standings" },
		{ name: "Teams", path: "/teams" },
	];

	const handleLinkClick = () => {
		setIsMenuOpen(false);
	};

	return (
		<nav className="bg-[#263C96] text-white shadow-lg flex justify-center">
			<div className="max-w-7xl px-8 w-full">
				<div className="flex justify-between items-center h-20">
					{/* Left: Logo and/or Title */}
					<div className="flex items-center">
						<Link
							to="/"
							className="font-semibold text-xl tracking-wide"
						>
							WPPL Scoring System Demo
						</Link>
					</div>

					{/* Right: Nav Links */}
					<div className="hidden md:flex items-center gap-6">
						{navLinks.map((link) => (
							<Link
								key={link.name}
								to={link.path}
								onClick={handleLinkClick}
								className="relative px-4 py-2 text-base font-medium transition-all duration-200 hover:text-[#FFD500]
                                           after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#FFD500]
                                           hover:after:w-full after:transition-all after:duration-300"
							>
								{link.name}
							</Link>
						))}
					</div>

					{/* Mobile menu toggle */}
					<button
						type="button"
						className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-white hover:text-[#FFD500] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#263C96] focus:ring-[#FFD500]"
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
					className={`md:hidden pt-2 pb-4 border-t border-white/10 ${
						isMenuOpen ? "block" : "hidden"
					}`}
				>
					<div className="flex flex-col gap-2">
						{navLinks.map((link) => (
							<Link
								key={link.name}
								to={link.path}
								onClick={handleLinkClick}
								className="px-2 py-2 text-base font-medium transition-colors duration-200 hover:text-[#FFD500]"
							>
								{link.name}
							</Link>
						))}
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
