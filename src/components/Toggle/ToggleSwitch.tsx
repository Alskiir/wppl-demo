import React, { useId } from "react";
import { Text } from "../Typography";

interface ToggleSwitchProps {
	checked: boolean;
	onChange: (checked: boolean) => void;
	className?: string;
	disabled?: boolean;
	label?: string;
	id?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
	checked,
	onChange,
	className = "",
	disabled = false,
	label,
	id,
}) => {
	const generatedId = useId();
	const inputId = id ?? generatedId;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!disabled) onChange(e.target.checked);
	};

	return (
		<div className={`inline-flex items-center gap-2 ${className}`}>
			{/* Hidden checkbox for accessibility */}
			<input
				type="checkbox"
				id={inputId}
				checked={checked}
				onChange={handleChange}
				disabled={disabled}
				className="peer sr-only"
			/>

			{/* Toggle body */}
			<label
				htmlFor={inputId}
				className={`
					relative flex h-7 w-[52px] cursor-pointer items-center rounded-xl border group
					transition-all duration-300 ease-in-out
					${checked ? "bg-blue-500 border-blue-600" : "bg-neutral-200 border-neutral-300"}
					${disabled ? "opacity-50 cursor-not-allowed" : "hover:brightness-95"}
					peer-focus-visible:ring-2 peer-focus-visible:ring-blue-400
				`}
			>
				{/* Inner track animation glow */}
				<span
					className={`
						absolute inset-0 rounded-xl transition-all duration-300 ease-in-out
						${
							checked
								? "shadow-[inset_0_0_6px_rgba(0,0,0,0.2)]"
								: "shadow-[inset_0_0_4px_rgba(0,0,0,0.1)]"
						}
					`}
				/>

				{/* Knob */}
				<span
					className={`
						relative z-10 h-5 w-5 rounded-lg bg-white border transition-all duration-300 ease-in-out
						transform ${
							checked
								? "translate-x-7 border-blue-600"
								: "translate-x-0.5 border-neutral-300"
						}
						${disabled ? "" : "group-hover:scale-[1.05]"}
						shadow-md
					`}
				/>
			</label>

			{/* Optional text label */}
			{label ? (
				<Text
					as="span"
					variant="muted"
					size="sm"
					className="select-none"
				>
					{label}
				</Text>
			) : null}
		</div>
	);
};

export default ToggleSwitch;
