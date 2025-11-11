import { useMemo } from "react";
import { Table } from "../../../components";
import type { StandingRecord } from "../hooks/useStandingsData";

const tableHeaders = [
	"Team",
	"Matches Won",
	"Matches Lost",
	"Win %",
	"Total Points",
];

type StandingsTableProps = {
	standings: StandingRecord[];
};

function StandingsTable({ standings }: StandingsTableProps) {
	const tableData = useMemo(
		() =>
			standings.map((row) => [
				row.team_name,
				formatNumber(row.matches_won),
				formatNumber(row.matches_lost),
				formatWinPercentage(row.win_percentage),
				formatNumber(row.total_points),
			]),
		[standings]
	);

	return <Table headers={tableHeaders} data={tableData} />;
}

function formatNumber(value: number | null): string {
	if (typeof value !== "number" || Number.isNaN(value)) {
		return "-";
	}

	return String(value);
}

function formatWinPercentage(value: number | null): string {
	if (typeof value !== "number" || Number.isNaN(value)) {
		return "-";
	}

	const normalized = value <= 1 ? value * 100 : value;
	return `${normalized.toFixed(1)}%`;
}

export default StandingsTable;
