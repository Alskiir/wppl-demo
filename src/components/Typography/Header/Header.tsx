import React from "react";

type HeaderLevel = 1 | 2 | 3 | 4 | 5 | 6;
type HeaderVariant = "primary" | "secondary" | "muted" | "accent" | "inverse";
type HeaderSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "display";
type HeaderAlign = "left" | "center" | "right";

const levelDefaults: Record<HeaderLevel, string> = {
	1: "text-4xl md:text-5xl",
	2: "text-3xl md:text-4xl",
	3: "text-2xl md:text-3xl",
	4: "text-xl md:text-2xl",
	5: "text-lg",
	6: "text-base",
};

const sizeClasses: Record<HeaderSize, string> = {
	xs: "text-sm",
	sm: "text-base",
	md: "text-lg",
	lg: "text-xl",
	xl: "text-2xl",
	"2xl": "text-3xl",
	"3xl": "text-4xl",
	display: "text-4xl md:text-5xl",
};

const variantClasses: Record<HeaderVariant, string> = {
	primary: "text-neutral-100",
	secondary: "text-neutral-200",
	muted: "text-neutral-400",
	accent: "text-sky-300",
	inverse: "text-neutral-950",
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
		"font-semibold leading-tight tracking-tight text-pretty",
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
