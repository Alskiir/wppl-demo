import { GAME_COLUMN_WIDTH_CLASS } from "../constants";
import type { GameScore } from "../types";

type GameColumnProps = {
	lineId: string;
	gameIndex: number;
	game: GameScore;
	onScoreChange: (
		lineId: string,
		gameIndex: number,
		field: "home" | "away",
		value: string
	) => void;
	columnWidth: number;
};

const GameColumn = ({
	lineId,
	gameIndex,
	game,
	onScoreChange,
	columnWidth,
}: GameColumnProps) => {
	const inputClass =
		"w-full rounded-2xl border border-(--border-subtle) bg-(--surface-input) px-3 py-2 pr-12 text-sm text-(--text-primary) transition-colors duration-200 focus:border-(--border-highlight) focus:outline-none appearance-none";

	const handleStep = (field: "home" | "away", delta: 1 | -1) => {
		const currentValue = Number(game[field] || 0);
		const safeValue = Number.isNaN(currentValue) ? 0 : currentValue;
		const nextValue = Math.max(0, safeValue + delta);
		onScoreChange(lineId, gameIndex, field, String(nextValue));
	};

	const renderScoreInput = (
		label: string,
		field: "home" | "away",
		value: string
	) => (
		<div className="space-y-1 text-xs">
			<span className="font-semibold text-(--text-subtle)">{label}</span>
			<div className="relative">
				<input
					type="number"
					min={0}
					step={1}
					inputMode="numeric"
					value={value}
					onChange={(event) =>
						onScoreChange(
							lineId,
							gameIndex,
							field,
							event.target.value
						)
					}
					className={inputClass}
				/>
				<div className="absolute inset-y-0 right-0 flex w-10 flex-col overflow-hidden rounded-r-2xl border-l border-(--border-subtle) bg-(--surface-card)">
					<button
						type="button"
						className="flex-1 text-(--text-subtle) transition-colors duration-150 hover:bg-(--surface-hover) hover:text-(--accent)"
						onClick={() => handleStep(field, 1)}
						aria-label={`Increase ${label} score`}
					>
						<svg
							viewBox="0 0 16 16"
							className="mx-auto h-3.5 w-3.5"
							fill="none"
							stroke="currentColor"
							strokeWidth={1.5}
						>
							<path
								d="M4 9l4-4 4 4"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</button>
					<button
						type="button"
						className="flex-1 text-(--text-subtle) transition-colors duration-150 hover:bg-(--surface-hover) hover:text-(--accent)"
						onClick={() => handleStep(field, -1)}
						aria-label={`Decrease ${label} score`}
					>
						<svg
							viewBox="0 0 16 16"
							className="mx-auto h-3.5 w-3.5"
							fill="none"
							stroke="currentColor"
							strokeWidth={1.5}
						>
							<path
								d="M4 7l4 4 4-4"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	);

	return (
		<td
			className={`${GAME_COLUMN_WIDTH_CLASS} align-top`}
			style={{
				width: `${columnWidth}px`,
				minWidth: `${columnWidth}px`,
			}}
		>
			<div className="flex flex-col gap-3">
				<label className="text-[11px] uppercase tracking-wide text-(--text-muted)">
					Game {gameIndex + 1}
				</label>
				<div className="space-y-3">
					{renderScoreInput("Team A", "away", game.away)}
					{renderScoreInput("Team H", "home", game.home)}
				</div>
			</div>
		</td>
	);
};

export default GameColumn;
