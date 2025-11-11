import type { PlayerOption } from "../types";

type PlayerSelectProps = {
	value: string;
	options: PlayerOption[];
	placeholder: string;
	disabled: boolean;
	onChange: (value: string) => void;
};

const PlayerSelect = ({
	value,
	options,
	placeholder,
	disabled,
	onChange,
}: PlayerSelectProps) => (
	<select
		className="w-full rounded-2xl border border-(--border-subtle) bg-(--surface-input) px-3 py-2 text-sm text-(--text-primary) transition-colors duration-200 focus:border-(--border-highlight) focus:outline-none disabled:cursor-not-allowed disabled:border-(--border-subtle) disabled:bg-(--surface-panel) disabled:text-(--text-subtle)"
		value={value}
		onChange={(event) => onChange(event.target.value)}
		disabled={disabled}
	>
		<option value="">{disabled ? "Select team first" : placeholder}</option>
		{options.map((player) => (
			<option key={player.id} value={player.id}>
				{player.fullName}
			</option>
		))}
	</select>
);

export default PlayerSelect;
