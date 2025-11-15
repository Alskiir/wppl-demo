import { memo, useCallback } from "react";
import {
	COLUMN_WIDTH_CLASS,
	GAME_COLUMN_WIDTH_CLASS,
	LINE_COLUMN_WIDTH_CLASS,
	MIN_GAMES_PER_LINE,
} from "../constants";
import type { LineFormState, PlayerOption, TeamOption } from "../types";
import GameColumn from "./GameColumn";
import PlayerSelect from "./PlayerSelect";
import { getColumnStyle } from "./columnSizing";

export type LineRowColumnWidths = {
	line: number;
	player: number;
	game: number;
	winner: number;
};

type LineRowProps = {
	line: LineFormState;
	maxGames: number;
	homeTeamId: string;
	awayTeamId: string;
	homeTeam?: TeamOption;
	awayTeam?: TeamOption;
	homePlayers: PlayerOption[];
	awayPlayers: PlayerOption[];
	onPlayerChange: (
		lineId: string,
		side: "teamA" | "teamH",
		slot: "player1Id" | "player2Id",
		value: string
	) => void;
	onGameScoreChange: (
		lineId: string,
		gameIndex: number,
		field: "home" | "away",
		value: string
	) => void;
	onWinnerChange: (lineId: string, value: string) => void;
	onAddGame: (lineId: string) => void;
	onRemoveGame: (lineId: string) => void;
	columnWidths: LineRowColumnWidths;
};

type TeamPlayersColumnProps = {
	label: string;
	side: "teamA" | "teamH";
	players: PlayerOption[];
	disabled: boolean;
	selections: LineFormState["teamA"];
	columnWidth: number;
	lineId: string;
	onPlayerChange: LineRowProps["onPlayerChange"];
};

const TeamPlayersColumn = memo(
	({
		label,
		side,
		players,
		disabled,
		selections,
		columnWidth,
		lineId,
		onPlayerChange,
	}: TeamPlayersColumnProps) => {
		const handlePlayerChange = useCallback(
			(slot: "player1Id" | "player2Id", value: string) => {
				onPlayerChange(lineId, side, slot, value);
			},
			[lineId, onPlayerChange, side]
		);

		return (
			<td
				className={`${COLUMN_WIDTH_CLASS} align-top`}
				style={getColumnStyle(columnWidth)}
			>
				<div className="flex flex-col gap-3">
					<span className="md-field-label">{label}</span>
					<div className="space-y-3">
						<div className="space-y-1 text-xs">
							<span className="md-field-label text-[0.7rem]">
								Player 1
							</span>
							<PlayerSelect
								value={selections.player1Id}
								options={players}
								placeholder="Player 1"
								disabled={disabled}
								onChange={(value) =>
									handlePlayerChange("player1Id", value)
								}
							/>
						</div>
						<div className="space-y-1 text-xs">
							<span className="md-field-label text-[0.7rem]">
								Player 2
							</span>
							<PlayerSelect
								value={selections.player2Id}
								options={players}
								placeholder="Player 2"
								disabled={disabled}
								onChange={(value) =>
									handlePlayerChange("player2Id", value)
								}
							/>
						</div>
					</div>
				</div>
			</td>
		);
	},
	(prev, next) =>
		prev.label === next.label &&
		prev.side === next.side &&
		prev.disabled === next.disabled &&
		prev.players === next.players &&
		prev.selections === next.selections &&
		prev.columnWidth === next.columnWidth &&
		prev.lineId === next.lineId &&
		prev.onPlayerChange === next.onPlayerChange
);

const LineRowComponent = ({
	line,
	maxGames,
	homeTeamId,
	awayTeamId,
	homeTeam,
	awayTeam,
	homePlayers,
	awayPlayers,
	onPlayerChange,
	onGameScoreChange,
	onWinnerChange,
	onAddGame,
	onRemoveGame,
	columnWidths,
}: LineRowProps) => {
	return (
		<tr className="text-sm text-(--text-secondary) border-b border-(--border-subtle) bg-(--surface-card) transition-colors duration-200 hover:bg-(--surface-hover)">
			<td
				className={`${LINE_COLUMN_WIDTH_CLASS} align-top font-semibold text-(--text-secondary)`}
				style={getColumnStyle(columnWidths.line)}
			>
				<div className="flex flex-col gap-3">
					<span className="text-base text-(--text-primary)">
						Line {line.lineNumber}
					</span>
					<div className="flex flex-wrap gap-2 text-xs font-normal mt-4 ml-1">
						<button
							type="button"
							onClick={() => onAddGame(line.id)}
							className="md-outlined-button md-button--compact game-count-button text-xs"
						>
							+
						</button>
						<button
							type="button"
							onClick={() => onRemoveGame(line.id)}
							className="md-outlined-button md-button--compact game-count-button text-xs"
							disabled={line.games.length <= MIN_GAMES_PER_LINE}
						>
							-
						</button>
					</div>
				</div>
			</td>
			<TeamPlayersColumn
				side="teamA"
				label="Team A"
				players={awayPlayers}
				disabled={!awayTeamId}
				selections={line.teamA}
				columnWidth={columnWidths.player}
				lineId={line.id}
				onPlayerChange={onPlayerChange}
			/>
			<TeamPlayersColumn
				side="teamH"
				label="Team H"
				players={homePlayers}
				disabled={!homeTeamId}
				selections={line.teamH}
				columnWidth={columnWidths.player}
				lineId={line.id}
				onPlayerChange={onPlayerChange}
			/>
			{Array.from({ length: maxGames }, (_, idx) => {
				const game = line.games[idx];
				if (game) {
					return (
						<GameColumn
							key={`${line.id}-game-${idx}`}
							lineId={line.id}
							gameIndex={idx}
							game={game}
							onScoreChange={onGameScoreChange}
							columnWidth={columnWidths.game}
						/>
					);
				}

				return (
					<td
						key={`${line.id}-placeholder-${idx}`}
						className={`${GAME_COLUMN_WIDTH_CLASS} align-top`}
						style={getColumnStyle(columnWidths.game)}
					>
						<div className="flex h-full min-h-16 items-center justify-center rounded border-2 border-dotted border-(--border-subtle) px-3 py-2 mt-15.5 text-center text-xs text-(--text-subtle)">
							Add a game to use this slot
						</div>
					</td>
				);
			})}
			<td
				className={`${COLUMN_WIDTH_CLASS} align-top`}
				style={getColumnStyle(columnWidths.winner)}
			>
				<div className="flex flex-col gap-3">
					<span className="md-field-label">Winner</span>
					<div className="space-y-3">
						<div className="space-y-1 text-xs">
							<span className="md-field-label text-[0.7rem] opacity-0">
								Winning Team
							</span>
							<select
								className="md-input md-input--compact md-select"
								value={line.winnerTeamId ?? ""}
								onChange={(event) =>
									onWinnerChange(line.id, event.target.value)
								}
								disabled={!homeTeamId || !awayTeamId}
							>
								<option value="">Select winner</option>
								{awayTeamId ? (
									<option value={awayTeamId}>
										Team A &mdash;{" "}
										{awayTeam?.name ?? "Away"}
									</option>
								) : null}
								{homeTeamId ? (
									<option value={homeTeamId}>
										Team H &mdash;{" "}
										{homeTeam?.name ?? "Home"}
									</option>
								) : null}
							</select>
						</div>
					</div>
				</div>
			</td>
		</tr>
	);
};

const areLineRowPropsEqual = (prev: LineRowProps, next: LineRowProps) =>
	prev.line === next.line &&
	prev.maxGames === next.maxGames &&
	prev.homeTeamId === next.homeTeamId &&
	prev.awayTeamId === next.awayTeamId &&
	prev.homeTeam === next.homeTeam &&
	prev.awayTeam === next.awayTeam &&
	prev.homePlayers === next.homePlayers &&
	prev.awayPlayers === next.awayPlayers &&
	prev.onPlayerChange === next.onPlayerChange &&
	prev.onGameScoreChange === next.onGameScoreChange &&
	prev.onWinnerChange === next.onWinnerChange &&
	prev.onAddGame === next.onAddGame &&
	prev.onRemoveGame === next.onRemoveGame &&
	prev.columnWidths === next.columnWidths;

export default memo(LineRowComponent, areLineRowPropsEqual);
