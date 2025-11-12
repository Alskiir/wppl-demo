import { useEffect, useMemo, useState } from "react";
import { GlassCard, PageShell, Table, Text } from "../../components";
import {
	databaseTables,
	fetchTableRows,
	type DatabaseTableName,
	type TableDescriptor,
} from "./api";

const descriptorMap = new Map<DatabaseTableName, TableDescriptor>(
	databaseTables.map((descriptor) => [descriptor.name, descriptor])
);

const formatColumnLabel = (column: string) =>
	column.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());

const formatCellValue = (value: unknown): string => {
	if (value === null || typeof value === "undefined") {
		return "—";
	}

	if (typeof value === "object") {
		try {
			return JSON.stringify(value);
		} catch {
			return String(value);
		}
	}

	const stringValue = String(value);
	return stringValue.length ? stringValue : "—";
};

const buildColumnOrder = (
	rows: Record<string, unknown>[],
	descriptor?: TableDescriptor
) => {
	const seen = new Set<string>();
	const ordered: string[] = [];

	if (descriptor?.columns) {
		for (const column of descriptor.columns) {
			if (!seen.has(column)) {
				seen.add(column);
				ordered.push(column);
			}
		}
	}

	for (const row of rows) {
		if (!row || typeof row !== "object") continue;

		for (const key of Object.keys(row)) {
			if (!seen.has(key)) {
				seen.add(key);
				ordered.push(key);
			}
		}
	}

	return ordered;
};

function AllTablesPage() {
	const availableTables = databaseTables;
	const hasTables = availableTables.length > 0;
	const [selectedTable, setSelectedTable] =
		useState<DatabaseTableName | null>(() =>
			hasTables ? availableTables[0]!.name : null
		);
	const [tableCache, setTableCache] = useState<
		Partial<Record<DatabaseTableName, Record<string, unknown>[]>>
	>({});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [reloadVersion, setReloadVersion] = useState(0);

	const activeDescriptor = selectedTable
		? descriptorMap.get(selectedTable)
		: undefined;
	const visibleRows = useMemo(() => {
		if (!selectedTable) return [];
		return tableCache[selectedTable] ?? [];
	}, [selectedTable, tableCache]);
	const hasCachedRows = visibleRows.length > 0;

	const columnOrder = useMemo(
		() => buildColumnOrder(visibleRows, activeDescriptor),
		[visibleRows, activeDescriptor]
	);

	useEffect(() => {
		if (!selectedTable) return;

		const tableName = selectedTable;

		let isMounted = true;

		async function loadTableData() {
			setIsLoading(true);
			setError(null);

			try {
				const data = await fetchTableRows(tableName);
				if (!isMounted) return;
				const normalized = Array.isArray(data) ? data : [];
				setTableCache((previous) => ({
					...previous,
					[tableName]: normalized,
				}));
			} catch (err) {
				console.error(err);
				if (!isMounted) return;

				const message =
					err instanceof Error
						? err.message
						: "Unable to load table data.";
				setError(message);
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		}

		void loadTableData();

		return () => {
			isMounted = false;
		};
	}, [selectedTable, reloadVersion]);

	const handleRefresh = () => {
		setReloadVersion((prev) => prev + 1);
	};

	const tableHeaders = columnOrder.map((column) => formatColumnLabel(column));
	const tableRows = visibleRows.map((row) =>
		columnOrder.map((column) => formatCellValue(row[column]))
	);
	const isLoadingWithoutCache = isLoading && !hasCachedRows;
	const showBlockingError = Boolean(error) && !hasCachedRows;
	const showInlineError = Boolean(error) && hasCachedRows;

	const actions = hasTables ? (
		<div className="flex flex-col gap-2 text-right md:text-left">
			<Text
				as="label"
				htmlFor="table-select"
				variant="eyebrow"
				size="xs"
				className="md-field-label"
			>
				Select table
			</Text>
			<div className="flex flex-wrap gap-3">
				<select
					id="table-select"
					value={selectedTable ?? ""}
					onChange={(event) =>
						setSelectedTable(
							event.target.value as DatabaseTableName
						)
					}
					className="md-input md-select w-full md:w-52"
				>
					{availableTables.map((table) => (
						<option key={table.name} value={table.name}>
							{table.label}
						</option>
					))}
				</select>
				<button
					type="button"
					onClick={handleRefresh}
					disabled={!selectedTable || isLoading}
					className="md-outlined-button"
				>
					{isLoading ? "Refreshing..." : "Refresh"}
				</button>
			</div>
		</div>
	) : null;

	let content: React.ReactNode;

	if (!hasTables) {
		content = (
			<GlassCard description="No tables are configured for display. Add descriptors in src/pages/AllTables/api.ts." />
		);
	} else if (!selectedTable) {
		content = (
			<GlassCard description="Choose a table from the dropdown to inspect its rows." />
		);
	} else if (showBlockingError) {
		content = (
			<GlassCard
				title="Unable to load data"
				description={error ?? undefined}
				footer="Confirm your Supabase credentials are configured in the .env file."
			/>
		);
	} else if (isLoadingWithoutCache) {
		content = (
			<GlassCard
				description={`Loading ${
					activeDescriptor?.label ?? "table"
				} data...`}
			/>
		);
	} else {
		content = (
			<div className="flex flex-col gap-6">
				{showInlineError ? (
					<GlassCard
						title="Unable to refresh data"
						description={error ?? undefined}
						footer="Showing the most recently cached rows for this table."
					/>
				) : null}
				<GlassCard
					title={activeDescriptor?.label ?? "Table details"}
					description={
						activeDescriptor?.description ??
						"Raw rows returned directly from Supabase."
					}
					details={[
						{
							label: "Table name",
							value: activeDescriptor?.name ?? "-",
						},
						{
							label: "Rows loaded",
							value: String(visibleRows.length),
						},
						{ label: "Columns", value: String(columnOrder.length) },
					]}
					footer="Results show the latest data returned by Supabase. Large tables may be truncated depending on server limits."
				/>
				<Table headers={tableHeaders} data={tableRows} />
			</div>
		);
	}

	return (
		<PageShell
			title="All Tables"
			description="Inspect every Supabase table backing the WPPL demo. Use the dropdown to switch between raw datasets."
			actions={actions}
		>
			{content}
		</PageShell>
	);
}

export default AllTablesPage;
