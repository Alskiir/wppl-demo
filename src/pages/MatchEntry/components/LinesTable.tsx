import { Text } from "../../../components";
import { COLUMN_WIDTH_CLASS } from "../constants";
import type { LineFormState, PlayerOption, TeamOption } from "../types";
import LineRow from "./LineRow";

type LinesTableProps = {
	lines: LineFormState[];
	maxGames: number;
	homeTeamId: string;
	awayTeamId: string;
	homeTeam?: TeamOption;
	awayTeam?: TeamOption;
	homePlayers: PlayerOption[];
	awayPlayers: PlayerOption[];
	onAddLine: () => void;
	onRemoveLine: () => void;
	onAddGameToLine: (lineId: string) => void;
	onRemoveGameFromLine: (lineId: string) => void;
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
};

const LinesTable = ({
	lines,
	maxGames,
	homeTeamId,
	awayTeamId,
	homeTeam,
	awayTeam,
	homePlayers,
	awayPlayers,
	onAddLine,
	onRemoveLine,
	onAddGameToLine,
	onRemoveGameFromLine,
	onPlayerChange,
	onGameScoreChange,
	onWinnerChange,
}: LinesTableProps) => (
	<section className="overflow-hidden rounded-3xl border border-(--border-strong) bg-(--surface-card)">
		<div className="flex flex-col gap-4 border-b border-(--border-subtle) bg-(--surface-panel) px-4 py-5 md:flex-row md:items-center md:justify-between md:px-6 md:py-6">
			<div className="space-y-2">
				<Text as="p" variant="strong" size="lg">
					Lines
				</Text>
				<Text variant="muted" size="sm" className="max-w-3xl">
					Default view shows five lines.
					<br />
					Adjust the number of lines or games per line to match the
					match sheet you are entering.
				</Text>
			</div>
			<div className="flex flex-wrap gap-3">
				<button
					type="button"
					onClick={onRemoveLine}
					className="rounded-2xl border border-(--border-subtle) bg-(--surface-card) px-4 py-2 text-sm text-(--text-secondary) transition-colors duration-200 hover:border-(--danger) hover:text-(--danger) disabled:cursor-not-allowed disabled:opacity-50"
					disabled={lines.length === 1}
				>
					Remove Line
				</button>
				<button
					type="button"
					onClick={onAddLine}
					className="rounded-2xl border border-(--border-highlight) px-4 py-2 text-sm font-semibold text-(--accent) transition-colors duration-200 hover:bg-(--surface-hover)"
				>
					Add Line
				</button>
			</div>
		</div>

		<div className="overflow-x-auto">
			<table className="w-full min-w-[960px] table-auto text-sm text-(--text-primary)">
				<thead className="bg-(--surface-panel)">
					<tr>
						<th
							className={`${COLUMN_WIDTH_CLASS} text-center first:text-left`}
						>
							<Text
								as="span"
								variant="tableHeader"
								size="xs"
								align="left"
							>
								Line
							</Text>
						</th>
						<th
							className={`${COLUMN_WIDTH_CLASS} text-center first:text-left`}
						>
							<Text
								as="span"
								variant="tableHeader"
								size="xs"
								align="center"
							>
								Player 1 (A)
							</Text>
						</th>
						<th
							className={`${COLUMN_WIDTH_CLASS} text-center first:text-left`}
						>
							<Text
								as="span"
								variant="tableHeader"
								size="xs"
								align="center"
							>
								Player 2 (A)
							</Text>
						</th>
						<th
							className={`${COLUMN_WIDTH_CLASS} text-center first:text-left`}
						>
							<Text
								as="span"
								variant="tableHeader"
								size="xs"
								align="center"
							>
								Player 1 (H)
							</Text>
						</th>
						<th
							className={`${COLUMN_WIDTH_CLASS} text-center first:text-left`}
						>
							<Text
								as="span"
								variant="tableHeader"
								size="xs"
								align="center"
							>
								Player 2 (H)
							</Text>
						</th>
						{Array.from({ length: maxGames }, (_, idx) => (
							<th
								key={`game-head-${idx}`}
								className={`${COLUMN_WIDTH_CLASS} text-center first:text-left`}
							>
								<Text
									as="span"
									variant="tableHeader"
									size="xs"
									align="center"
								>
									Game {idx + 1}
								</Text>
							</th>
						))}
						<th
							className={`${COLUMN_WIDTH_CLASS} text-center first:text-left`}
						>
							<Text
								as="span"
								variant="tableHeader"
								size="xs"
								align="center"
							>
								Winner
							</Text>
						</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-(--border-subtle)">
					{lines.map((line) => (
						<LineRow
							key={line.id}
							line={line}
							maxGames={maxGames}
							homeTeamId={homeTeamId}
							awayTeamId={awayTeamId}
							homeTeam={homeTeam}
							awayTeam={awayTeam}
							homePlayers={homePlayers}
							awayPlayers={awayPlayers}
							onPlayerChange={onPlayerChange}
							onGameScoreChange={onGameScoreChange}
							onWinnerChange={onWinnerChange}
							onAddGame={onAddGameToLine}
							onRemoveGame={onRemoveGameFromLine}
						/>
					))}
				</tbody>
			</table>
		</div>
	</section>
);

export default LinesTable;
