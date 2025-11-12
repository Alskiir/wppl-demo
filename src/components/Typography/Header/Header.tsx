import React from "react";

type HeaderLevel = 1 | 2 | 3 | 4 | 5 | 6;
type HeaderVariant = "primary" | "secondary" | "muted" | "accent" | "inverse";
type HeaderSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "display";
type HeaderAlign = "left" | "center" | "right";

const levelDefaults: Record<HeaderLevel, string> = {
	1: "text-[clamp(2.5rem,4vw,3.75rem)] leading-[1.05]",
	2: "text-[clamp(2rem,3.5vw,3rem)] leading-tight",
	3: "text-[clamp(1.75rem,3vw,2.5rem)] leading-tight",
	4: "text-[clamp(1.5rem,2.5vw,2rem)] leading-snug",
	5: "text-xl leading-snug",
	6: "text-base leading-normal",
};

const sizeClasses: Record<HeaderSize, string> = {
	xs: "text-sm leading-snug",
	sm: "text-base leading-snug",
	md: "text-lg leading-snug",
	lg: "text-2xl leading-tight",
	xl: "text-3xl leading-tight",
	"2xl": "text-[2.5rem] leading-tight",
	"3xl": "text-[3rem] leading-[1.05]",
	display: "text-[clamp(2.75rem,5vw,4.25rem)] leading-[1.02]",
};

const variantClasses: Record<HeaderVariant, string> = {
	primary: "text-[var(--text-primary)]",
	secondary: "text-[var(--text-secondary)]",
	muted: "text-[var(--text-muted)]",
	accent: "text-[var(--accent)]",
	inverse: "text-[var(--text-inverse)]",
};

const alignClasses: Record<HeaderAlign, string> = {
	left: "text-left",
	center: "text-center",
	right: "text-right",
};

interface HeaderProps extends React.HTMLAttributes<HTMLHeadingElement> {
	level?: HeaderLevel;
	variant?: HeaderVariant;
	size?: HeaderSize;
	align?: HeaderAlign;
}

const Header: React.FC<HeaderProps> = ({
	level = 1,
	variant = "primary",
	size,
	align = "left",
	className,
	children,
	...rest
}) => {
	const HeadingTag = `h${level}` as React.ElementType;
	const resolvedSize = size ? sizeClasses[size] : levelDefaults[level];

	const componentClassName = [
		"font-semibold tracking-tight text-balance",
		resolvedSize,
		variantClasses[variant],
		alignClasses[align],
		className,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<HeadingTag className={componentClassName} {...rest}>
			{children}
		</HeadingTag>
	);
};

export type {
	HeaderProps,
	HeaderLevel,
	HeaderVariant,
	HeaderSize,
	HeaderAlign,
};

export default Header;
