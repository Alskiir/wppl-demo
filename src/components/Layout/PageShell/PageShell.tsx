import React from "react";
import { Header, Text } from "../../Typography";

interface PageShellProps {
	title: string;
	description?: string;
	actions?: React.ReactNode;
	children: React.ReactNode;
	maxWidthClass?: string;
	paddingClass?: string;
	className?: string;
}

const PageShell: React.FC<PageShellProps> = ({
	title,
	description,
	actions,
	children,
	maxWidthClass = "max-w-6xl",
	paddingClass = "px-6 md:px-12",
	className = "",
}) => {
	return (
		<div
			className={`flex min-h-screen flex-col bg-(--surface-base) ${className}`}
		>
			<main className="flex-1 py-12 md:py-16">
				<div
					className={`mx-auto flex ${maxWidthClass} flex-col gap-10 ${paddingClass}`}
				>
					<header className="flex flex-wrap items-start justify-between gap-4 border-b border-(--border-subtle) pb-6">
						<div className="flex flex-col gap-2">
							<Header level={1}>{title}</Header>
							{description ? (
								<Text variant="muted" size="sm">
									{description}
								</Text>
							) : null}
						</div>
						{actions ? (
							<div className="flex shrink-0 items-center gap-3">
								{actions}
							</div>
						) : null}
					</header>

					{children}
				</div>
			</main>
		</div>
	);
};

export default PageShell;
