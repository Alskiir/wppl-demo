import { useCallback, useEffect, useRef, useState } from "react";
import { Table } from "../../../components";
import { DEFAULT_TABLE_PAGE_SIZE } from "../../../constants/pagination";
import { copyTextToClipboard } from "../../../utils/clipboard";
import type { TeamRosterEntry } from "../types";
import { useTeamRosterColumns } from "../hooks/useTeamRosterColumns";
import { useTeamRosterFilters } from "../hooks/useTeamRosterFilters";
import { downloadRosterCsv, downloadRosterPdf } from "../utils/exportRoster";
import TeamRosterToolbar from "./TeamRosterToolbar";

type TeamRosterTableProps = {
	roster: TeamRosterEntry[];
	teamName?: string;
};

function TeamRosterTable({ roster, teamName }: TeamRosterTableProps) {
	const [copiedValue, setCopiedValue] = useState<string | null>(null);
	const copyTimeoutRef = useRef<number | null>(null);
	const canExportRoster = roster.length > 0;

	const {
		filteredRoster,
		roleOptions,
		roleFilter,
		setRoleFilter,
		searchQuery,
		setSearchQuery,
		hasActiveFilters,
		clearFilters,
	} = useTeamRosterFilters(roster);

	const handleExport = useCallback(
		(format: "csv" | "pdf") => {
			if (!canExportRoster) {
				return;
			}

			if (format === "csv") {
				downloadRosterCsv(roster, teamName);
			} else {
				downloadRosterPdf(roster, teamName);
			}
		},
		[canExportRoster, roster, teamName]
	);

	const handleCopyValue = useCallback(async (value: string) => {
		if (!value) {
			return;
		}

		try {
			await copyTextToClipboard(value);
			setCopiedValue(value);

			if (typeof window !== "undefined") {
				if (copyTimeoutRef.current) {
					window.clearTimeout(copyTimeoutRef.current);
				}

				copyTimeoutRef.current = window.setTimeout(
					() => setCopiedValue(null),
					2000
				);
			}
		} catch {
			// Ignore clipboard failures and keep the UI responsive.
		}
	}, []);

	useEffect(() => {
		return () => {
			if (
				typeof window !== "undefined" &&
				copyTimeoutRef.current !== null
			) {
				window.clearTimeout(copyTimeoutRef.current);
			}
		};
	}, []);

	const columns = useTeamRosterColumns({
		copiedValue,
		onCopyValue: handleCopyValue,
	});

	const toolbarContent = (
		<TeamRosterToolbar
			searchQuery={searchQuery}
			roleFilter={roleFilter}
			roleOptions={roleOptions}
			onSearchChange={setSearchQuery}
			onRoleFilterChange={setRoleFilter}
			filteredCount={filteredRoster.length}
			totalCount={roster.length}
			hasActiveFilters={hasActiveFilters}
			onClearFilters={clearFilters}
			canExport={canExportRoster}
			onExportCsv={() => handleExport("csv")}
			onExportPdf={() => handleExport("pdf")}
		/>
	);

	return (
		<Table
			columns={columns}
			data={filteredRoster}
			pageSize={DEFAULT_TABLE_PAGE_SIZE}
			getRowId={(row, index) => row.person.id ?? index}
			initialSortColumnId="player"
			initialSortDirection="asc"
			emptyMessage={
				hasActiveFilters
					? "No players match the current filters."
					: "No players found on this roster."
			}
			toolbar={toolbarContent}
			toolbarClassName="px-4 py-4 md:px-6 md:py-5"
		/>
	);
}

export default TeamRosterTable;
