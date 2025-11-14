import React from "react";
import { Header, Text } from "../../Typography";

interface PageShellProps {
	title: string;
	description?: React.ReactNode;
	descriptionAs?: React.ElementType;
	actions?: React.ReactNode;
	children: React.ReactNode;
	maxWidthClass?: string;
	paddingClass?: string;
	className?: string;
}

const PageShell: React.FC<PageShellProps> = ({
	title,
	description,
	descriptionAs,
	actions,
	children,
	maxWidthClass = "max-w-6xl",
	paddingClass = "px-6 md:px-10",
	className = "",
}) => {
	return (
		<div className={`min-h-screen bg-(--surface-backdrop) ${className}`}>
			<main className="py-12 md:py-16">
				<div
					className={`mx-auto flex ${maxWidthClass} flex-col gap-10 ${paddingClass}`}
				>
					<header className="md-card bg-(--surface-panel) px-6 py-6 shadow-(--md-sys-elevation-1)">
						<div className="flex flex-wrap items-start justify-between gap-6">
							<div className="flex flex-col gap-2">
								<Header
									level={1}
									variant="primary"
									size="display"
								>
									{title}
								</Header>
								{description ? (
									<Text
										as={descriptionAs}
										variant="muted"
										size="sm"
									>
										{description}
									</Text>
								) : null}
							</div>
							{actions ? (
								<div className="flex shrink-0 flex-wrap items-center gap-3">
									{actions}
								</div>
							) : null}
						</div>
					</header>

					{children}
				</div>
			</main>
		</div>
	);
};

export default PageShell;
