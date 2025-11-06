import React, { useId } from "react";
import { Text } from "../Typography";

interface DropdownOption {
	value: string;
	label: string;
	disabled?: boolean;
}

interface FilterDropdownProps {
	label?: string;
	placeholder?: string;
	value: string | null;
	onChange: (nextValue: string | null) => void;
	options: DropdownOption[];
	className?: string;
	name?: string;
	disabled?: boolean;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
	label,
	placeholder = "Select an option",
	value,
	onChange,
	options,
	className = "",
	name,
	disabled = false,
}) => {
	const generatedId = useId();
	const selectId = name ?? generatedId;

	const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const nextValue = event.target.value;
		onChange(nextValue === "" ? null : nextValue);
	};

	return (
		<div className={`flex w-full max-w-xs flex-col gap-2 ${className}`}>
			{label ? (
				<Text as="label" htmlFor={selectId} variant="eyebrow" size="xs">
					{label}
				</Text>
			) : null}

			<div className="relative">
				<select
					id={selectId}
					name={selectId}
					value={value ?? ""}
					onChange={handleChange}
					disabled={disabled}
					className={`peer w-full appearance-none rounded-xl border border-neutral-800/70 bg-neutral-900/70 px-5 py-3 text-sm font-medium text-neutral-100 shadow-[0_12px_30px_rgba(15,23,42,0.35)] transition-all duration-200 focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-500/40 disabled:cursor-not-allowed disabled:border-neutral-700 disabled:bg-neutral-800/50 disabled:text-neutral-500`}
				>
					<option value="" disabled={placeholder === null}>
						{placeholder}
					</option>
					{options.map((option) => (
						<option
							key={option.value}
							value={option.value}
							disabled={option.disabled}
						>
							{option.label}
						</option>
					))}
				</select>

				<span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-neutral-400 transition-transform duration-200 peer-focus:text-sky-300">
					<svg
						className="h-4 w-4"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={1.5}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M6 9l6 6 6-6"
						/>
					</svg>
				</span>
			</div>
		</div>
	);
};

export default FilterDropdown;
