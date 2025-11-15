type ContactCellProps = {
	value?: string | null;
	type: "email" | "phone";
	onCopy: (value: string) => void;
	copiedValue: string | null;
};

const buildTelHref = (value: string) => {
	const cleaned = value.replace(/[^\d+]/g, "");
	return `tel:${cleaned}`;
};

const CopyIcon = ({ className }: { className?: string }) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		className={className}
	>
		<rect
			x="9"
			y="9"
			width="10"
			height="12"
			rx="2"
			stroke="currentColor"
			strokeWidth="1.7"
		/>
		<path
			d="M5 15V5a2 2 0 0 1 2-2h10"
			stroke="currentColor"
			strokeWidth="1.7"
			strokeLinecap="round"
		/>
	</svg>
);

const MailIcon = ({ className }: { className?: string }) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		className={className}
	>
		<rect
			x="3"
			y="5"
			width="18"
			height="14"
			rx="2"
			stroke="currentColor"
			strokeWidth="1.7"
		/>
		<path
			d="M4 7.5 12 13l8-5.5"
			stroke="currentColor"
			strokeWidth="1.7"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

const PhoneIcon = ({ className }: { className?: string }) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		className={className}
	>
		<path
			d="M7 3h2.5l1.5 6-2 1.5c1.1 2.1 2.9 3.9 5 5l1.5-2 6 1.5V21c0 1.1-.9 2-2 2C9.611 23 1 14.389 1 4c0-1.1.9-2 2-2h4z"
			stroke="currentColor"
			strokeWidth="1.7"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

const ContactCell = ({
	value,
	type,
	onCopy,
	copiedValue,
}: ContactCellProps) => {
	const resolvedValue = value?.trim();

	if (!resolvedValue) {
		return <span className="text-(--text-muted)">-</span>;
	}

	const iconClass = "h-4 w-4";
	const isEmail = type === "email";
	const actionLabel = isEmail ? "Email" : "Call";
	const href = isEmail
		? `mailto:${resolvedValue}`
		: buildTelHref(resolvedValue);
	const Icon = isEmail ? MailIcon : PhoneIcon;
	const isCopied = copiedValue === resolvedValue;

	return (
		<div className="flex flex-col items-center gap-2 text-center">
			<span className="break-all text-sm font-medium text-(--text-primary)">
				{resolvedValue}
			</span>
			<div className="flex flex-wrap items-center justify-center gap-2">
				<a
					href={href}
					className="md-outlined-button md-button--compact inline-flex items-center gap-2 text-xs"
					style={{
						padding: "0.35rem 0.9rem",
						minHeight: "unset",
						fontSize: "0.75rem",
					}}
				>
					<Icon className={iconClass} aria-hidden="true" />
					<span>{actionLabel}</span>
				</a>
				<button
					type="button"
					onClick={() => onCopy(resolvedValue)}
					className={`copy-button inline-flex items-center gap-1 rounded-full border border-(--border-subtle) px-3 py-1 text-xs font-semibold transition-colors ${
						isCopied ? "copy-button--success" : ""
					}`}
				>
					<CopyIcon className={iconClass} aria-hidden="true" />
					<span>Copy</span>
					<span
						className={`copy-button__toast ${
							isCopied ? "copy-button__toast--visible" : ""
						}`}
						aria-hidden="true"
					>
						Copied!
					</span>
					<span className="sr-only" aria-live="polite">
						{isCopied ? "Copied to clipboard" : "Copy address"}
					</span>
				</button>
			</div>
		</div>
	);
};

export default ContactCell;
