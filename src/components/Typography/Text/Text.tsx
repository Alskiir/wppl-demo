import React from "react";

type TextSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
type TextVariant =
	| "body"
	| "muted"
	| "subtle"
	| "strong"
	| "accent"
	| "inverse"
	| "eyebrow"
	| "eyebrowMuted"
	| "nav"
	| "brand"
	| "tableHeader"
	| "tableCell"
	| "caption";
type TextAlign = "left" | "center" | "right" | "justify";

const sizeClasses: Record<TextSize, string> = {
	xs: "text-[0.75rem] leading-[1.35] tracking-[0.04em]",
	sm: "text-[0.875rem] leading-[1.5]",
	md: "text-base leading-[1.6]",
	lg: "text-lg leading-[1.6]",
	xl: "text-[1.35rem] leading-[1.4]",
	"2xl": "text-[1.75rem] leading-[1.3]",
};

const variantClasses: Record<TextVariant, string> = {
	body: "text-[var(--text-primary)]",
	muted: "text-[var(--text-secondary)]",
	subtle: "text-[var(--text-muted)]",
	strong: "text-[var(--text-secondary)] font-semibold",
	accent: "text-[var(--accent)] font-semibold",
	inverse: "text-[var(--text-inverse)]",
	eyebrow:
		"text-[var(--text-muted)] uppercase tracking-[0.28em] font-semibold leading-tight",
	eyebrowMuted:
		"text-[var(--text-subtle)] uppercase tracking-[0.28em] font-semibold leading-tight",
	nav: "text-[var(--text-secondary)] font-semibold tracking-[0.12em] uppercase",
	brand: "text-[var(--accent)] font-semibold tracking-[0.18em] uppercase",
	tableHeader:
		"text-[var(--text-muted)] uppercase tracking-[0.2em] font-semibold leading-tight",
	tableCell:
		"text-[var(--text-primary)] font-medium tracking-[0.01em] leading-snug",
	caption: "text-[var(--text-subtle)] leading-snug",
};

const alignClasses: Record<TextAlign, string> = {
	left: "text-left",
	center: "text-center",
	right: "text-right",
	justify: "text-justify",
};

type TextProps<T extends React.ElementType = "p"> = {
	as?: T;
	variant?: TextVariant;
	size?: TextSize;
	align?: TextAlign;
	className?: string;
	children: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

const Text = <T extends React.ElementType = "p">({
	as,
	variant = "body",
	size = "md",
	align = "left",
	className,
	children,
	...rest
}: TextProps<T>) => {
	const Component = as ?? "p";

	const componentClassName = [
		"font-normal text-pretty",
		sizeClasses[size],
		variantClasses[variant],
		alignClasses[align],
		className,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<Component className={componentClassName} {...rest}>
			{children}
		</Component>
	);
};

export type { TextProps, TextSize, TextVariant, TextAlign };
export default Text;
