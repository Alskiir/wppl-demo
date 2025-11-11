import { COLUMN_WIDTH_CLASS, MIN_GAMES_PER_LINE } from "../constants";
import type { LineFormState, PlayerOption, TeamOption } from "../types";
import GameColumn from "./GameColumn";
import PlayerSelect from "./PlayerSelect";

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
}: LineRowProps) => (
	<tr className="text-sm text-(--text-secondary) odd:bg-(--surface-card) even:bg-(--surface-raised) transition-colors duration-200 hover:bg-(--surface-hover)">
		<td
			className={`${COLUMN_WIDTH_CLASS} align-top font-semibold text-(--text-secondary)`}
		>
			<div className="flex flex-col gap-2">
				<span>Line {line.lineNumber}</span>
				<div className="flex flex-wrap gap-2 text-[11px] font-normal">
					<button
						type="button"
						onClick={() => onAddGame(line.id)}
						className="rounded-xl border border-(--border-subtle) px-2 py-1 text-(--text-secondary) transition-colors duration-200 hover:border-(--border-highlight) hover:text-(--accent)"
					>
						+
					</button>
					<button
						type="button"
						onClick={() => onRemoveGame(line.id)}
						className="rounded-xl border border-(--border-subtle) px-2 py-1 text-(--text-secondary) transition-colors duration-200 hover:border-(--danger) hover:text-(--danger) disabled:cursor-not-allowed disabled:opacity-40"
						disabled={line.games.length <= MIN_GAMES_PER_LINE}
					>
						-
					</button>
				</div>
			</div>
		</td>
		<td className={COLUMN_WIDTH_CLASS}>
			<PlayerSelect
				value={line.teamA.player1Id}
				options={awayPlayers}
				placeholder="Player 1"
				disabled={!awayTeamId}
				onChange={(value) =>
					onPlayerChange(line.id, "teamA", "player1Id", value)
				}
			/>
		</td>
		<td className={COLUMN_WIDTH_CLASS}>
			<PlayerSelect
				value={line.teamA.player2Id}
				options={awayPlayers}
				placeholder="Player 2"
				disabled={!awayTeamId}
				onChange={(value) =>
					onPlayerChange(line.id, "teamA", "player2Id", value)
				}
			/>
		</td>
		<td className={COLUMN_WIDTH_CLASS}>
			<PlayerSelect
				value={line.teamH.player1Id}
				options={homePlayers}
				placeholder="Player 1"
				disabled={!homeTeamId}
				onChange={(value) =>
					onPlayerChange(line.id, "teamH", "player1Id", value)
				}
			/>
		</td>
		<td className={COLUMN_WIDTH_CLASS}>
			<PlayerSelect
				value={line.teamH.player2Id}
				options={homePlayers}
				placeholder="Player 2"
				disabled={!homeTeamId}
				onChange={(value) =>
					onPlayerChange(line.id, "teamH", "player2Id", value)
				}
			/>
		</td>
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
					/>
				);
			}

			return (
				<td
					key={`${line.id}-placeholder-${idx}`}
					className={`${COLUMN_WIDTH_CLASS} align-top`}
				>
					<div className="text-xs text-(--text-subtle)">
						Add a game to use this slot
					</div>
				</td>
			);
		})}
		<td className={COLUMN_WIDTH_CLASS}>
			<select
				className="w-full rounded-2xl border border-(--border-subtle) bg-(--surface-input) px-3 py-2 text-sm text-(--text-primary) transition-colors duration-200 focus:border-(--border-highlight) focus:outline-none disabled:cursor-not-allowed disabled:border-(--border-subtle) disabled:bg-(--surface-panel) disabled:text-(--text-subtle)"
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

export default LineRow;
