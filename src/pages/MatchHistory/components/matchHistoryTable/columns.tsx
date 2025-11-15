import { Text, type TableColumn } from "../../../../components";
import type { MatchHistoryEntry } from "../../types";
import ResultBadge from "./ResultBadge";
import {
	compareText,
	formatDateLabel,
	formatTimeLabel,
	getMatchTimestamp,
} from "./formatters";

const buildOpponentCell = (row: MatchHistoryEntry) => (
	<div className="flex flex-col gap-1">
		<Text as="span" variant="strong" size="sm">
			{row.opponentName}
		</Text>
		<Text as="span" variant="muted" size="xs">
			{row.isHomeMatch ? "Hosting" : "Away match"}
		</Text>
	</div>
);

const buildVenueCell = (row: MatchHistoryEntry) => (
	<div className="flex flex-col gap-1">
		<Text as="span" variant="strong" size="sm">
			{row.location ?? "TBD"}
		</Text>
		<Text as="span" variant="muted" size="xs">
			{row.isHomeMatch ? "Home" : "Away"}
		</Text>
	</div>
);

export const buildMatchHistoryColumns = (
	safeTeamName: string,
	expandedMatchId: string | null,
	onToggleLines: (matchId: string) => void
): TableColumn<MatchHistoryEntry>[] => [
	{
		id: "date",
		header: "Date",
		align: "center",
		sortFn: (a, b) => getMatchTimestamp(a) - getMatchTimestamp(b),
		accessor: (row) => {
			const dateLabel = formatDateLabel(row.matchDate);
			const timeLabel = formatTimeLabel(row.matchTime);

			return (
				<div className="flex flex-col gap-1">
					<Text as="span" variant="strong" size="sm">
						{dateLabel}
					</Text>
					{timeLabel ? (
						<Text as="span" variant="muted" size="xs">
							{timeLabel}
						</Text>
					) : null}
				</div>
			);
		},
	},
	{
		id: "opponent",
		header: "Opponent",
		align: "center",
		sortFn: (a, b) => compareText(a.opponentName, b.opponentName),
		accessor: (row) => buildOpponentCell(row),
	},
	{
		id: "venue",
		header: "Venue",
		align: "center",
		accessor: (row) => buildVenueCell(row),
	},
	{
		id: "lines",
		header: "Lines",
		headerHint: "(Win / Loss)",
		align: "center",
		accessor: (row) => (
			<div className="flex flex-col gap-1">
				<div className="flex flex-wrap items-center gap-x-2 gap-y-2">
					<Text as="span" variant="strong" size="lg">
						{row.teamScore}
					</Text>
					<Text as="span" variant="muted" size="sm">
						-
					</Text>
					<Text as="span" variant="strong" size="lg">
						{row.opponentScore}
					</Text>
					<ResultBadge result={row.result} />
				</div>
				<Text as="span" variant="subtle" size="xs">
					{safeTeamName} {row.isHomeMatch ? "(Home)" : "(Away)"} vs{" "}
					{row.opponentName}
				</Text>
			</div>
		),
	},
	{
		id: "games",
		header: "Games",
		headerHint: "(Win / Loss)",
		align: "center",
		accessor: (row) => (
			<div className="flex flex-col items-center gap-1">
				<div className="flex items-center gap-x-2">
					<Text as="span" variant="strong" size="lg">
						{row.gamesWon}
					</Text>
					<Text as="span" variant="muted" size="sm">
						-
					</Text>
					<Text as="span" variant="strong" size="lg">
						{row.gamesLost}
					</Text>
				</div>
			</div>
		),
	},
	{
		id: "points",
		header: "Points Earned",
		align: "center",
		accessor: (row) => (
			<div className="flex flex-col items-center gap-1">
				<Text as="span" variant="strong" size="md">
					{row.pointsEarned}
				</Text>
			</div>
		),
	},
	{
		id: "lineDetails",
		header: "Line Breakdown",
		align: "center",
		accessor: (row) => (
			<button
				type="button"
				onClick={() => onToggleLines(row.id)}
				className={[
					"rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)",
					expandedMatchId === row.id
						? "border-(--accent-muted) bg-(--accent-muted) text-(--md-sys-color-on-primary-container) shadow-(--md-sys-elevation-1) hover:border-(--accent)"
						: "border-(--border-subtle) text-(--accent) hover:border-(--accent) hover:bg-(--surface-hover)",
				].join(" ")}
				aria-pressed={expandedMatchId === row.id}
			>
				{expandedMatchId === row.id
					? "Hide Line breakdown"
					: "View Line breakdown"}
			</button>
		),
	},
];
