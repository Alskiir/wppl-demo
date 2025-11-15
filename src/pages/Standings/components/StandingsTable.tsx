import { useMemo } from "react";
import { Table, type TableColumn } from "../../../components";
import { DEFAULT_TABLE_PAGE_SIZE } from "../../../constants/pagination";
import type { StandingRecord } from "../hooks/useStandingsData";

type StandingsTableProps = {
	standings: StandingRecord[];
};

function StandingsTable({ standings }: StandingsTableProps) {
	const columns = useMemo<TableColumn<StandingRecord>[]>(() => {
		const buildNumericSort =
			(getValue: (row: StandingRecord) => number | null) =>
			(a: StandingRecord, b: StandingRecord) => {
				const aValue = getValue(a);
				const bValue = getValue(b);
				const safeA = Number.isFinite(aValue)
					? Number(aValue)
					: Number.NEGATIVE_INFINITY;
				const safeB = Number.isFinite(bValue)
					? Number(bValue)
					: Number.NEGATIVE_INFINITY;
				return safeA - safeB;
			};

		return [
			{
				id: "team",
				header: "Team",
				align: "left",
				accessor: (row) => row.team_name,
				sortFn: (a, b) =>
					(a.team_name ?? "").localeCompare(b.team_name ?? ""),
			},
			{
				id: "matchesWon",
				header: "Matches Won",
				align: "center",
				accessor: (row) => formatNumber(row.matches_won),
				sortFn: buildNumericSort((row) => row.matches_won),
			},
			{
				id: "matchesLost",
				header: "Matches Lost",
				align: "center",
				accessor: (row) => formatNumber(row.matches_lost),
				sortFn: buildNumericSort((row) => row.matches_lost),
			},
			{
				id: "winPercentage",
				header: "Win %",
				align: "center",
				accessor: (row) => formatWinPercentage(row.win_percentage),
				sortFn: buildNumericSort((row) => row.win_percentage),
			},
			{
				id: "totalPoints",
				header: "Total Points",
				align: "center",
				accessor: (row) => formatNumber(row.total_points),
				sortFn: buildNumericSort((row) => row.total_points),
			},
		];
	}, []);

	return (
		<Table
			columns={columns}
			data={standings}
			pageSize={DEFAULT_TABLE_PAGE_SIZE}
			initialSortColumnId="totalPoints"
			initialSortDirection="desc"
			getRowId={(row) => row.team_id ?? row.team_name}
			emptyMessage="No standings available."
		/>
	);
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
