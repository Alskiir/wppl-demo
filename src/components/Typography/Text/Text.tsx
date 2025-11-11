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
	xs: "text-xs",
	sm: "text-sm",
	md: "text-base",
	lg: "text-lg",
	xl: "text-xl",
	"2xl": "text-2xl",
};

const variantClasses: Record<TextVariant, string> = {
	body: "text-[var(--text-primary)]",
	muted: "text-[var(--text-secondary)]",
	subtle: "text-[var(--text-muted)]",
	strong: "text-[var(--text-secondary)] font-semibold",
	accent: "text-[var(--accent)] font-semibold",
	inverse: "text-[var(--text-inverse)]",
	eyebrow:
		"text-[var(--text-muted)] uppercase tracking-[0.32em] font-semibold leading-tight",
	eyebrowMuted:
		"text-[var(--text-subtle)] uppercase tracking-[0.32em] font-semibold leading-tight",
	nav: "text-[var(--text-muted)] uppercase tracking-[0.28em] font-semibold leading-tight",
	brand: "text-[var(--text-secondary)] uppercase tracking-[0.20em] font-semibold leading-tight",
	tableHeader:
		"text-[var(--text-secondary)] uppercase tracking-[0.22em] font-semibold leading-tight",
	tableCell: "text-[var(--text-primary)] font-medium",
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
		"font-normal leading-relaxed text-pretty",
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
