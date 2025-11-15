import { useCallback, useEffect, useMemo, useState } from "react";
import { Table, Text } from "../../../components";
import type { MatchHistoryEntry } from "../types";
import LineDetailsPanel from "./matchHistoryTable/LineDetailsPanel";
import { buildMatchHistoryColumns } from "./matchHistoryTable/columns";

type MatchHistoryTableProps = {
	rows: MatchHistoryEntry[];
	teamName?: string;
};

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
		() =>
			buildMatchHistoryColumns(
				safeTeamName,
				expandedMatchId,
				toggleMatch
			),
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
