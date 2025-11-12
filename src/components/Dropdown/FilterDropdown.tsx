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
				<Text
					as="label"
					htmlFor={selectId}
					variant="eyebrow"
					size="xs"
					className="md-field-label"
				>
					{label}
				</Text>
			) : null}

			<select
				id={selectId}
				name={selectId}
				value={value ?? ""}
				onChange={handleChange}
				disabled={disabled}
				className="md-input md-select"
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
		</div>
	);
};

export default FilterDropdown;
