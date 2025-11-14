import { Table, Text } from "../../../components";
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

const headers = [
	<HeaderLabel key="date" label="Date" />,
	<HeaderLabel key="opponent" label="Opponent" />,
	<HeaderLabel key="venue" label="Venue" />,
	<HeaderLabel key="lines" label="Lines" hint="(Win / Loss)" />,
	<HeaderLabel key="games" label="Games" hint="(Win / Loss)" />,
	<HeaderLabel key="points" label="Points Earned" />,
];

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

function MatchHistoryTable({ rows, teamName }: MatchHistoryTableProps) {
	const safeTeamName = teamName?.trim().length
		? teamName.trim()
		: "Selected Team";

	const tableRows = rows.map((row) => {
		const dateLabel = formatDateLabel(row.matchDate);
		const timeLabel = formatTimeLabel(row.matchTime);

		const opponentCell = (
			<div className="flex flex-col gap-1">
				<Text as="span" variant="strong" size="sm">
					{row.opponentName}
				</Text>
				<Text as="span" variant="muted" size="xs">
					{row.isHomeMatch ? "Hosting" : "Away match"}
				</Text>
			</div>
		);

		const venueCell = (
			<div className="flex flex-col gap-1">
				<Text as="span" variant="strong" size="sm">
					{row.location ?? "TBD"}
				</Text>
				<Text as="span" variant="muted" size="xs">
					{row.isHomeMatch ? "Home" : "Away"}
				</Text>
			</div>
		);

		const linesCell = (
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
				<Text as="span" variant="subtle" size="xs">
					Lines won / lost
				</Text>
			</div>
		);

		const gamesCell = (
			<div className="flex flex-col gap-1 items-center">
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
		);

		const pointsCell = (
			<div className="flex flex-col gap-1 items-center">
				<Text as="span" variant="strong" size="md">
					{row.pointsEarned}
				</Text>
			</div>
		);

		return [
			<div className="flex flex-col gap-1" key={`${row.id}-date`}>
				<Text as="span" variant="strong" size="sm">
					{dateLabel}
				</Text>
				{timeLabel ? (
					<Text as="span" variant="muted" size="xs">
						{timeLabel}
					</Text>
				) : null}
			</div>,
			opponentCell,
			venueCell,
			linesCell,
			gamesCell,
			pointsCell,
		];
	});

	return <Table headers={headers} data={tableRows} />;
}

export default MatchHistoryTable;
