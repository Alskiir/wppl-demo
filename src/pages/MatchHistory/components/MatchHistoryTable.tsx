import { useMemo } from "react";
import { Table, Text, type TableColumn } from "../../../components";
import type { MatchHistoryEntry, MatchResult } from "../types";

type MatchHistoryTableProps = {
	rows: MatchHistoryEntry[];
	teamName?: string;
};

const HeaderLabel = ({ label, hint }: { label: string; hint?: string }) => (
	<span className="flex flex-col items-center leading-tight text-center">
		<span className="text-[0.9rem] font-semibold text-(--text-primary)">
			{label}
		</span>
		{hint ? (
			<span className="text-[0.65rem] font-normal text-(--text-muted)">
				{hint}
			</span>
		) : null}
	</span>
);

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
	safeTeamName: string
): TableColumn<MatchHistoryEntry>[] => [
	{
		id: "date",
		header: <HeaderLabel label="Date" />,
		align: "left",
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
		header: <HeaderLabel label="Opponent" />,
		align: "left",
		sortFn: (a, b) => compareText(a.opponentName, b.opponentName),
		accessor: (row) => buildOpponentCell(row),
	},
	{
		id: "venue",
		header: <HeaderLabel label="Venue" />,
		align: "left",
		accessor: (row) => buildVenueCell(row),
	},
	{
		id: "lines",
		header: <HeaderLabel label="Lines" hint="(Win / Loss)" />,
		align: "left",
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
		header: <HeaderLabel label="Games" hint="(Win / Loss)" />,
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
		header: <HeaderLabel label="Points Earned" />,
		align: "center",
		accessor: (row) => (
			<div className="flex flex-col items-center gap-1">
				<Text as="span" variant="strong" size="md">
					{row.pointsEarned}
				</Text>
			</div>
		),
	},
];

function MatchHistoryTable({ rows, teamName }: MatchHistoryTableProps) {
	const safeTeamName = teamName?.trim().length
		? teamName.trim()
		: "Selected Team";

	const columns = useMemo(() => buildColumns(safeTeamName), [safeTeamName]);

	return (
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
	);
}

export default MatchHistoryTable;
