import React from "react";
import { Header, Text } from "../../Typography";

type GlassCardDetail = {
	label: string;
	value: string;
};

type GlassCardListItem = {
	title?: string;
	description: string;
};

interface GlassCardProps {
	title?: string;
	description?: string;
	details?: GlassCardDetail[];
	listItems?: GlassCardListItem[];
	listVariant?: "definition" | "bullet";
	listColumns?: 1 | 2;
	footer?: string;
	className?: string;
	children?: React.ReactNode;
}

const GlassCard: React.FC<GlassCardProps> = ({
	title,
	description,
	details,
	listItems,
	listVariant = "definition",
	listColumns = 1,
	footer,
	className = "",
	children,
}) => {
	const hasList = Boolean(listItems?.length);
	const hasDetails = Boolean(details?.length);

	return (
		<div
			className={`rounded-3xl border border-(--border-strong) bg-(--surface-card) p-8 ${className}`}
		>
			{title ? (
				<Header level={2} size="lg">
					{title}
				</Header>
			) : null}

			{description ? (
				<Text
					variant="muted"
					size="sm"
					className={title ? "mt-3" : undefined}
				>
					{description}
				</Text>
			) : null}

			{hasDetails ? (
				<dl className="mt-4 grid gap-3 sm:grid-cols-2">
					{details!.map((detail) => (
						<div
							key={detail.label}
							className="rounded-2xl border border-(--border-highlight) bg-(--surface-raised) px-4 py-3"
						>
							<Text as="dt" variant="eyebrowMuted" size="xs">
								{detail.label}
							</Text>
							<Text
								as="dd"
								variant="strong"
								size="sm"
								className="mt-1"
							>
								{detail.value}
							</Text>
						</div>
					))}
				</dl>
			) : null}

			{hasList ? (
				<ul
					className={`mt-4 grid gap-3 ${
						listColumns === 2 ? "md:grid-cols-2" : ""
					}`}
				>
					{listItems!.map((item, index) => (
						<li
							key={item.title ?? item.description ?? index}
							className="rounded-2xl border border-(--border-highlight) bg-(--surface-raised) px-4 py-3"
						>
							{listVariant === "definition" && item.title ? (
								<div className="flex flex-wrap items-baseline gap-x-1">
									<Text as="span" variant="strong" size="sm">
										{item.title}
									</Text>
									<Text as="span" variant="muted" size="sm">
										- {item.description}
									</Text>
								</div>
							) : (
								<Text as="span" variant="muted" size="sm">
									{item.description}
								</Text>
							)}
						</li>
					))}
				</ul>
			) : null}

			{footer ? (
				<Text variant="muted" size="sm" className="mt-4">
					{footer}
				</Text>
			) : null}

			{children}
		</div>
	);
};

export default GlassCard;
