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
		className="md-input md-select"
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
