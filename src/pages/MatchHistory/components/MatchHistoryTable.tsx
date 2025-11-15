import { useCallback, useEffect, useMemo, useState } from "react";
import { Table, Text, type TableColumn } from "../../../components";
import type { MatchHistoryEntry, MatchLineDetail, MatchResult } from "../types";

type MatchHistoryTableProps = {
	rows: MatchHistoryEntry[];
	teamName?: string;
};

const resultLabelMap: Record<MatchResult, string> = {
	win: "Win",
	loss: "Loss",
	tie: "Tie",
};

const resultToneMap: Record<MatchResult, string> = {
	win: "border-(--accent) text-(--accent) bg-(--surface-hover)",
	loss: "border-(--danger) text-(--danger) bg-(--surface-hover)",
	tie: "border-(--text-muted) text-(--text-muted) bg-(--surface-hover)",
};

const formatDateLabel = (dateString: string) => {
	if (!dateString) return "TBD";

	const [year, month, day] = dateString.split("-").map(Number);
	if (
		[year, month, day].some(
			(part) => typeof part !== "number" || Number.isNaN(part)
		)
	) {
		return dateString;
	}

	const date = new Date(Date.UTC(year, (month ?? 1) - 1, day));

	return new Intl.DateTimeFormat(undefined, {
		month: "short",
		day: "numeric",
		year: "numeric",
		timeZone: "UTC",
	}).format(date);
};

const formatTimeLabel = (timeString: string | null) => {
	if (!timeString) return null;
	const [rawHours, rawMinutes] = timeString.split(":");
	const hours = Number(rawHours);
	const minutes = Number(rawMinutes);

	if (
		!Number.isFinite(hours) ||
		!Number.isFinite(minutes) ||
		hours < 0 ||
		minutes < 0
	) {
		return timeString;
	}

	const date = new Date(Date.UTC(1970, 0, 1, hours, minutes));

	return new Intl.DateTimeFormat(undefined, {
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
		timeZone: "UTC",
	}).format(date);
};

const ResultBadge = ({ result }: { result: MatchResult }) => (
	<span
		className={`rounded-full border px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wide ${resultToneMap[result]}`}
	>
		{resultLabelMap[result]}
	</span>
);

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

const formatScoreValue = (value: number | null) =>
	typeof value === "number" && Number.isFinite(value) ? value : "—";

type LineDetailCardProps = {
	line: MatchLineDetail;
	homeLabel: string;
	awayLabel: string;
};

const LineDetailCard = ({
	line,
	homeLabel,
	awayLabel,
}: LineDetailCardProps) => (
	<div className="rounded-lg border border-(--border-subtle) bg-(--surface-card) p-4">
		<div className="flex flex-wrap items-center justify-between gap-2">
			<div className="flex flex-col">
				<Text as="span" variant="strong" size="sm">
					Line {line.lineNumber}
				</Text>
				<Text as="span" variant="muted" size="xs">
					{homeLabel} vs {awayLabel}
				</Text>
			</div>
			<ResultBadge result={line.result} />
		</div>
		{line.games.length ? (
			<div className="mt-3 flex flex-col gap-2">
				{line.games.map((game, gameIndex) => (
					<div
						key={game.id}
						className="rounded-lg border border-(--border-subtle) bg-(--surface-panel) px-3 py-2"
					>
						<Text as="p" variant="subtle" size="xs">
							Game {gameIndex + 1}
						</Text>
						<div className="mt-1 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
							<div>
								<Text as="p" variant="strong" size="xs">
									{homeLabel}
								</Text>
								<Text as="p" variant="strong" size="lg">
									{formatScoreValue(game.homeScore)}
								</Text>
							</div>
							<div className="text-right">
								<Text as="p" variant="strong" size="xs">
									{awayLabel}
								</Text>
								<Text as="p" variant="strong" size="lg">
									{formatScoreValue(game.awayScore)}
								</Text>
							</div>
						</div>
					</div>
				))}
			</div>
		) : (
			<Text as="p" variant="muted" size="xs" className="mt-3">
				No games recorded for this line yet.
			</Text>
		)}
	</div>
);

type LineDetailsPanelProps = {
	match: MatchHistoryEntry;
	teamName: string;
	onClose: () => void;
};

const LineDetailsPanel = ({
	match,
	teamName,
	onClose,
}: LineDetailsPanelProps) => {
	const homeLabel = match.isHomeMatch ? teamName : match.opponentName;
	const awayLabel = match.isHomeMatch ? match.opponentName : teamName;

	return (
		<div className="rounded-xl border border-(--border-default) bg-(--surface-panel) p-4 shadow-sm">
			<div className="flex flex-wrap items-center justify-between gap-2">
				<div className="flex flex-col">
					<Text as="span" variant="strong" size="sm">
						Line breakdown vs {match.opponentName}
					</Text>
					<Text as="span" variant="muted" size="xs">
						View the pairs, individual games, and winners captured
						when this match was recorded.
					</Text>
				</div>
				<button
					type="button"
					onClick={onClose}
					className="rounded-full border border-(--border-subtle) px-3 py-1 text-xs font-semibold uppercase tracking-wide text-(--text-muted) transition-colors hover:bg-(--surface-hover)"
				>
					Hide details
				</button>
			</div>
			{match.lines.length ? (
				<div className="mt-4 grid gap-4 md:grid-cols-2">
					{match.lines.map((line) => (
						<LineDetailCard
							key={line.id}
							line={line}
							homeLabel={homeLabel}
							awayLabel={awayLabel}
						/>
					))}
				</div>
			) : (
				<Text as="p" variant="muted" size="sm" className="mt-4">
					No line breakdown has been logged for this match.
				</Text>
			)}
		</div>
	);
};

const getMatchTimestamp = (row: MatchHistoryEntry) => {
	const [year, month, day] = row.matchDate?.split("-").map(Number) ?? [];
	const [hours, minutes] = row.matchTime?.split(":").map(Number) ?? [];

	if (
		!Number.isFinite(year) ||
		!Number.isFinite(month) ||
		!Number.isFinite(day)
	) {
		return 0;
	}

	const normalizedHours = Number.isFinite(hours) ? hours : 0;
	const normalizedMinutes = Number.isFinite(minutes) ? minutes : 0;

	return Date.UTC(
		year!,
		(month ?? 1) - 1,
		day!,
		normalizedHours,
		normalizedMinutes
	);
};

const compareText = (a?: string | null, b?: string | null) => {
	const aValue = a?.toLowerCase().trim() ?? "";
	const bValue = b?.toLowerCase().trim() ?? "";
	return aValue.localeCompare(bValue);
};

const buildColumns = (
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
						? "border-(--accent) bg-(--accent) text-white hover:bg-(--accent-dark)"
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

function MatchHistoryTable({ rows, teamName }: MatchHistoryTableProps) {
	const safeTeamName = teamName?.trim().length
		? teamName.trim()
		: "Selected Team";

	const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);

	const toggleMatch = useCallback((matchId: string) => {
		setExpandedMatchId((prev) => (prev === matchId ? null : matchId));
	}, []);

	useEffect(() => {
		if (!expandedMatchId) {
			return;
		}

		const stillVisible = rows.some((row) => row.id === expandedMatchId);
		if (!stillVisible) {
			setExpandedMatchId(null);
		}
	}, [rows, expandedMatchId]);

	const expandedMatch = useMemo(
		() => rows.find((row) => row.id === expandedMatchId) ?? null,
		[rows, expandedMatchId]
	);

	const columns = useMemo(
		() => buildColumns(safeTeamName, expandedMatchId, toggleMatch),
		[safeTeamName, expandedMatchId, toggleMatch]
	);

	return (
		<div className="flex flex-col gap-4">
			<Table
				columns={columns}
				data={rows}
				initialSortColumnId="date"
				initialSortDirection="desc"
				getRowId={(row) => row.id}
				emptyMessage={
					<Text variant="caption" size="sm">
						No matches recorded for this team.
					</Text>
				}
			/>
			{expandedMatch ? (
				<LineDetailsPanel
					match={expandedMatch}
					teamName={safeTeamName}
					onClose={() => setExpandedMatchId(null)}
				/>
			) : null}
		</div>
	);
}

export default MatchHistoryTable;
