import { memo, useCallback, useMemo } from "react";
import { GAME_COLUMN_WIDTH_CLASS } from "../constants";
import { getColumnStyle } from "./columnSizing";
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

const GameColumnComponent = ({
	lineId,
	gameIndex,
	game,
	onScoreChange,
	columnWidth,
}: GameColumnProps) => {
	const inputClass = "md-input md-input--compact pr-12";

	const columnStyle = useMemo(
		() => getColumnStyle(columnWidth),
		[columnWidth]
	);

	const handleScoreChange = useCallback(
		(field: "home" | "away", value: string) => {
			onScoreChange(lineId, gameIndex, field, value);
		},
		[gameIndex, lineId, onScoreChange]
	);

	const handleStep = useCallback(
		(field: "home" | "away", delta: 1 | -1) => {
			const currentValue = Number(game[field] || 0);
			const safeValue = Number.isNaN(currentValue) ? 0 : currentValue;
			const nextValue = Math.max(0, safeValue + delta);
			handleScoreChange(field, String(nextValue));
		},
		[game, handleScoreChange]
	);

	const renderScoreInput = (
		label: string,
		field: "home" | "away",
		value: string
	) => (
		<div className="space-y-1 text-xs">
			<span className="md-field-label">{label}</span>
			<div className="relative">
				<input
					type="number"
					min={0}
					step={1}
					inputMode="numeric"
					value={value}
					onChange={(event) =>
						handleScoreChange(field, event.target.value)
					}
					className={inputClass}
				/>
				<div className="absolute inset-y-1 right-1 flex w-6 flex-col overflow-hidden rounded-[18px] border border-(--border-subtle) bg-(--surface-panel)">
					<button
						type="button"
						className="flex-1 text-(--text-secondary) transition-colors duration-150 hover:bg-(--surface-hover) hover:text-(--accent)"
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
						className="flex-1 text-(--text-secondary) transition-colors duration-150 hover:bg-(--surface-hover) hover:text-(--accent)"
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
			style={columnStyle}
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

const areGameColumnPropsEqual = (
	prev: GameColumnProps,
	next: GameColumnProps
) =>
	prev.lineId === next.lineId &&
	prev.gameIndex === next.gameIndex &&
	prev.game === next.game &&
	prev.columnWidth === next.columnWidth &&
	prev.onScoreChange === next.onScoreChange;

export default memo(GameColumnComponent, areGameColumnPropsEqual);
