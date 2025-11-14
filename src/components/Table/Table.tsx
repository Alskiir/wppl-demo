import React, { useEffect, useMemo, useState } from "react";
import { Text } from "../Typography";

export type TableRow = Array<React.ReactNode>;
export type SortDirection = "asc" | "desc";

export type TableColumn<T> = {
	id: string;
	header: React.ReactNode;
	accessor: (row: T, rowIndex: number) => React.ReactNode;
	sortFn?: (a: T, b: T) => number;
	align?: "left" | "center" | "right";
	className?: string;
	headerClassName?: string;
};

type BaseTableProps = {
	className?: string;
	isLoading?: boolean;
	skeletonRowCount?: number;
	emptyMessage?: React.ReactNode;
	pageSize?: number;
	initialSortColumnId?: string;
	initialSortDirection?: SortDirection;
	onSortChange?: (state: SortState | null) => void;
};

type ColumnDrivenTableProps<T> = BaseTableProps & {
	columns: TableColumn<T>[];
	data: T[];
	headers?: never;
	getRowId?: (row: T, index: number) => string | number;
};

type SimpleTableProps = BaseTableProps & {
	headers: React.ReactNode[];
	data: TableRow[];
	columns?: undefined;
};

export type TableProps<T = TableRow> =
	| ColumnDrivenTableProps<T>
	| SimpleTableProps;

type SortState = {
	columnId: string;
	direction: SortDirection;
};

const defaultEmptyMessage = (
	<Text variant="caption" size="sm">
		No data available.
	</Text>
);

const alignmentClassMap: Record<
	NonNullable<TableColumn<unknown>["align"]>,
	string
> = {
	left: "text-left",
	center: "text-center",
	right: "text-right",
};
const emptyColumns: TableColumn<never>[] = [];

const Table = <T,>({
	className = "",
	isLoading = false,
	skeletonRowCount = 5,
	emptyMessage = defaultEmptyMessage,
	pageSize,
	initialSortColumnId,
	initialSortDirection = "asc",
	onSortChange,
	...rest
}: TableProps<T>) => {
	const columnDefinitions = (rest as ColumnDrivenTableProps<T>).columns;
	const hasColumnDefinitions = Array.isArray(columnDefinitions);
	const headers = !hasColumnDefinitions
		? (rest as SimpleTableProps).headers
		: undefined;
	const rawData = rest.data as T[];
	const resolvedColumns = (columnDefinitions ??
		emptyColumns) as TableColumn<T>[];
	const columnCount = hasColumnDefinitions
		? resolvedColumns.length
		: headers?.length ?? 0;
	const normalizedPageSize =
		typeof pageSize === "number" && pageSize > 0
			? Math.max(1, Math.floor(pageSize))
			: undefined;
	const [sortState, setSortState] = useState<SortState | null>(() =>
		hasColumnDefinitions && initialSortColumnId
			? {
					columnId: initialSortColumnId,
					direction: initialSortDirection,
			  }
			: null
	);
	const [currentPage, setCurrentPage] = useState(0);
	const getRowId =
		(rest as ColumnDrivenTableProps<T>).getRowId ??
		((_, index: number) => index);

	useEffect(() => {
		if (!hasColumnDefinitions) {
			return;
		}

		setSortState((previous) => {
			if (
				previous &&
				resolvedColumns.some((column) => column.id === previous.columnId)
			) {
				return previous;
			}

			if (
				initialSortColumnId &&
				resolvedColumns.some(
					(column) => column.id === initialSortColumnId
				)
			) {
				return {
					columnId: initialSortColumnId,
					direction: initialSortDirection,
				};
			}

			return null;
		});
	}, [
		hasColumnDefinitions,
		initialSortColumnId,
		initialSortDirection,
		resolvedColumns,
	]);

	const sortedData = useMemo(() => {
		if (!hasColumnDefinitions || !sortState) {
			return rawData;
		}

		const targetColumn = resolvedColumns.find(
			(column) => column.id === sortState.columnId
		);

		if (!targetColumn || typeof targetColumn.sortFn !== "function") {
			return rawData;
		}

		const dataCopy = [...rawData];
		const modifier = sortState.direction === "asc" ? 1 : -1;

		dataCopy.sort((a, b) => modifier * targetColumn.sortFn!(a, b));
		return dataCopy;
	}, [hasColumnDefinitions, rawData, resolvedColumns, sortState]);

	const totalPages = normalizedPageSize
		? Math.max(1, Math.ceil(sortedData.length / normalizedPageSize))
		: 1;
	const safePage = normalizedPageSize
		? Math.min(currentPage, totalPages - 1)
		: 0;
	const paginatedData = useMemo(() => {
		if (!normalizedPageSize) {
			return sortedData;
		}

		const start = safePage * normalizedPageSize;
		return sortedData.slice(start, start + normalizedPageSize);
	}, [normalizedPageSize, safePage, sortedData]);

	const hasRows = paginatedData.length > 0;
	const showEmptyState = !isLoading && !hasRows;
	const skeletonRows = Array.from(
		{ length: isLoading ? Math.max(skeletonRowCount, 1) : 0 },
		(_, skeletonIndex) => (
			<tr key={`skeleton-${skeletonIndex}`} className="animate-pulse">
				{Array.from({ length: Math.max(columnCount, 1) }).map(
					(_, skeletonCellIndex) => (
						<td
							key={`skeleton-cell-${skeletonIndex}-${skeletonCellIndex}`}
							className="px-5 py-4"
						>
							<div className="h-4 w-full rounded bg-(--surface-panel)" />
						</td>
					)
				)}
			</tr>
		)
	);

	const handleSortClick = (columnId: string) => {
		if (!hasColumnDefinitions) return;
		const targetColumn = resolvedColumns.find(
			(column) => column.id === columnId
		);
		if (!targetColumn || typeof targetColumn.sortFn !== "function") {
			return;
		}

		setSortState((previous) => {
			const nextDirection =
				previous?.columnId === columnId && previous.direction === "asc"
					? "desc"
					: "asc";
			const nextState: SortState = {
				columnId,
				direction:
					previous?.columnId === columnId ? nextDirection : "asc",
			};
			onSortChange?.(nextState);
			return nextState;
		});
	};

	const resolvedClassName = ["md-card overflow-hidden", className]
		.filter(Boolean)
		.join(" ");
	const showPagination =
		normalizedPageSize !== undefined &&
		sortedData.length > normalizedPageSize;
	const rangeStart = normalizedPageSize
		? safePage * normalizedPageSize + 1
		: 1;
	const rangeEnd = normalizedPageSize
		? Math.min(sortedData.length, (safePage + 1) * normalizedPageSize)
		: sortedData.length;

	return (
		<div className={resolvedClassName}>
			<div className="overflow-x-auto">
				<table className="min-w-full table-auto text-sm text-(--text-primary)">
					<thead className="bg-(--surface-panel)">
						<tr>
							{hasColumnDefinitions && resolvedColumns.length
								? resolvedColumns.map((column, index) => {
										const canSort =
											typeof column.sortFn === "function";
										const isActive =
											sortState?.columnId === column.id;
										const direction = isActive
											? sortState?.direction
											: null;
										const alignment =
											column.align ??
											(index === 0 ? "left" : "center");

										return (
											<th
												key={column.id}
												className={`px-6 py-4 ${
													alignmentClassMap[alignment]
												} ${
													column.headerClassName ?? ""
												}`}
												scope="col"
											>
												{canSort ? (
													<button
														type="button"
														onClick={() =>
															handleSortClick(
																column.id
															)
														}
														className="inline-flex items-center gap-1 text-left font-semibold text-(--text-primary)"
													>
														<Text
															as="span"
															variant="tableHeader"
															size="xs"
														>
															{column.header}
														</Text>
														{direction ? (
															<span
																aria-hidden="true"
																className="text-(--text-muted)"
															>
																{direction ===
																"asc"
																	? "^"
																	: "v"}
															</span>
														) : null}
													</button>
												) : (
													<Text
														as="span"
														variant="tableHeader"
														size="xs"
													>
														{column.header}
													</Text>
												)}
											</th>
										);
								  })
								: headers?.map((header, index) => (
										<th
											key={`table-header-${index}`}
											className="px-6 py-4 text-center first:text-left"
											scope="col"
										>
											<Text
												as="span"
												variant="tableHeader"
												size="xs"
											>
												{header}
											</Text>
										</th>
								  ))}
						</tr>
					</thead>
					<tbody className="divide-y divide-(--border-subtle)">
						{hasColumnDefinitions
							? paginatedData.map((row, rowIndex) => (
									<tr
										key={
											getRowId(row, rowIndex) ??
											`table-row-${rowIndex}`
										}
										className="transition-colors duration-200 hover:bg-(--surface-hover)"
									>
										{resolvedColumns.map(
											(column, columnIndex) => {
												const alignment =
													column.align ??
													(columnIndex === 0
														? "left"
														: "center");
												return (
													<td
														key={`${column.id}-${columnIndex}`}
														className={`px-5 py-4 align-middle ${
															alignmentClassMap[
																alignment
															]
														} ${
															column.className ??
															""
														}`}
													>
														{column.accessor(
															row,
															rowIndex
														)}
													</td>
												);
											}
										)}
									</tr>
							  ))
							: (paginatedData as unknown as TableRow[]).map(
									(row, rowIndex) => (
										<tr
											key={`table-row-${rowIndex}`}
											className="transition-colors duration-200 hover:bg-(--surface-hover)"
										>
											{(headers ?? []).map(
												(_, colIndex) => (
													<td
														key={`table-cell-${rowIndex}-${colIndex}`}
														className="px-5 py-4 text-center align-middle first:text-left"
													>
														<Text
															as="span"
															variant="tableCell"
															size="sm"
														>
															{row[colIndex] ??
																null}
														</Text>
													</td>
												)
											)}
										</tr>
									)
							  )}
						{showEmptyState ? (
							<tr>
								<td
									colSpan={Math.max(columnCount, 1)}
									className="px-6 py-6 text-center"
								>
									{emptyMessage}
								</td>
							</tr>
						) : null}
						{skeletonRows}
					</tbody>
				</table>
			</div>
			{showPagination ? (
				<div className="flex flex-col gap-3 border-t border-(--border-subtle) bg-(--surface-panel) px-4 py-4 text-sm text-(--text-muted) md:flex-row md:items-center md:justify-between">
					<span>
						Showing {rangeStart}-{rangeEnd} of {sortedData.length}
					</span>
					<div className="flex gap-2">
						<button
							type="button"
							onClick={() =>
								setCurrentPage((prev) => Math.max(prev - 1, 0))
							}
							disabled={safePage === 0}
							className="md-outlined-button text-xs disabled:opacity-50"
						>
							Previous
						</button>
						<button
							type="button"
							onClick={() =>
								setCurrentPage((prev) =>
									Math.min(prev + 1, totalPages - 1)
								)
							}
							disabled={safePage >= totalPages - 1}
							className="md-outlined-button text-xs disabled:opacity-50"
						>
							Next
						</button>
					</div>
				</div>
			) : null}
		</div>
	);
};

export default Table;
