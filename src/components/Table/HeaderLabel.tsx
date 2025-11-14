type HeaderLabelAlignment = "left" | "center" | "right";

export type HeaderLabelProps = {
	label: string;
	hint?: string;
	align?: HeaderLabelAlignment;
	className?: string;
};

const alignmentClasses: Record<HeaderLabelAlignment, string> = {
	left: "items-start text-left",
	center: "items-center text-center",
	right: "items-end text-right",
};

const HeaderLabel = ({
	label,
	hint,
	align = "center",
	className,
}: HeaderLabelProps) => {
	const resolvedClassName = [
		"flex flex-col gap-0.5 leading-tight",
		alignmentClasses[align],
		className,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<span className={resolvedClassName}>
			<span className="text-[0.9rem] font-semibold text-(--text-primary)">
				{label}
			</span>
			{hint ? (
				<span className="text-[0.65rem] font-normal text-(--text-muted)">
					{hint}
				</span>
			) : null}
		</span>
	);
};

export default HeaderLabel;
