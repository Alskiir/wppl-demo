import {
	COLUMN_WIDTH_CLASS,
	GAME_COLUMN_WIDTH_CLASS,
	LINE_COLUMN_WIDTH_CLASS,
	MIN_GAMES_PER_LINE,
} from "../constants";
import type { LineFormState, PlayerOption, TeamOption } from "../types";
import GameColumn from "./GameColumn";
import PlayerSelect from "./PlayerSelect";

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

const LineRow = ({
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
	const getColumnStyle = (value: number) => ({
		width: `${value}px`,
		minWidth: `${value}px`,
	});

	const renderTeamPlayers = (
		side: "teamA" | "teamH",
		label: string,
		players: PlayerOption[],
		disabled: boolean,
		selections: LineFormState["teamA"]
	) => (
		<td
			className={`${COLUMN_WIDTH_CLASS} align-top`}
			style={getColumnStyle(columnWidths.player)}
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
								onPlayerChange(
									line.id,
									side,
									"player1Id",
									value
								)
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
								onPlayerChange(
									line.id,
									side,
									"player2Id",
									value
								)
							}
						/>
					</div>
				</div>
			</div>
		</td>
	);

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
					<div className="flex flex-wrap gap-2 text-xs font-normal">
						<button
							type="button"
							onClick={() => onAddGame(line.id)}
							className="md-outlined-button px-3 py-2 text-xs"
						>
							+ Game
						</button>
						<button
							type="button"
							onClick={() => onRemoveGame(line.id)}
							className="md-outlined-button px-3 py-2 text-xs"
							disabled={line.games.length <= MIN_GAMES_PER_LINE}
						>
							- Game
						</button>
					</div>
				</div>
			</td>
			{renderTeamPlayers(
				"teamA",
				"Team A",
				awayPlayers,
				!awayTeamId,
				line.teamA
			)}
			{renderTeamPlayers(
				"teamH",
				"Team H",
				homePlayers,
				!homeTeamId,
				line.teamH
			)}
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
						<div className="text-xs text-(--text-subtle)">
							Add a game to use this slot
						</div>
					</td>
				);
			})}
			<td
				className={COLUMN_WIDTH_CLASS}
				style={getColumnStyle(columnWidths.winner)}
			>
				<select
					className="md-input md-select"
					value={line.winnerTeamId ?? ""}
					onChange={(event) =>
						onWinnerChange(line.id, event.target.value)
					}
					disabled={!homeTeamId || !awayTeamId}
				>
					<option value="">Select winner</option>
					{awayTeamId ? (
						<option value={awayTeamId}>
							Team A &mdash; {awayTeam?.name ?? "Away"}
						</option>
					) : null}
					{homeTeamId ? (
						<option value={homeTeamId}>
							Team H &mdash; {homeTeam?.name ?? "Home"}
						</option>
					) : null}
				</select>
			</td>
		</tr>
	);
};

export default LineRow;
