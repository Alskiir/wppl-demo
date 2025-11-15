import { Text } from "../../Typography";
import { alignmentClassMap } from "../headerUtils";
import type { TableColumn, TableRow } from "../types";

type TableBodyProps<T> = {
	hasColumnDefinitions: boolean;
	columns: TableColumn<T>[];
	columnRows: T[];
	simpleRows: TableRow[];
	headers?: React.ReactNode[];
	columnCount: number;
	emptyMessage: React.ReactNode;
	isLoading: boolean;
	skeletonRowCount: number;
	showEmptyState: boolean;
	getRowId: (row: T, index: number) => string | number | undefined;
};

const buildSkeletonRows = (count: number, columnCount: number) =>
	Array.from({ length: count }, (_, skeletonIndex) => (
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
	));

const TableBody = <T,>({
	hasColumnDefinitions,
	columns,
	columnRows,
	simpleRows,
	headers,
	columnCount,
	emptyMessage,
	isLoading,
	skeletonRowCount,
	showEmptyState,
	getRowId,
}: TableBodyProps<T>) => {
	const skeletonRows = buildSkeletonRows(
		isLoading ? Math.max(skeletonRowCount, 1) : 0,
		columnCount
	);

	return (
		<tbody className="divide-y divide-(--border-subtle)">
			{hasColumnDefinitions
				? columnRows.map((row, rowIndex) => (
						<tr
							key={
								getRowId(row, rowIndex) ??
								`table-row-${rowIndex}`
							}
							className="transition-colors duration-200 hover:bg-(--surface-hover)"
						>
							{columns.map((column, columnIndex) => {
								const alignment =
									column.align ??
									(columnIndex === 0 ? "left" : "center");
								return (
									<td
										key={`${column.id}-${columnIndex}`}
										className={`px-5 py-4 align-middle ${
											alignmentClassMap[alignment]
										} ${column.className ?? ""}`}
									>
										{column.accessor(row, rowIndex)}
									</td>
								);
							})}
						</tr>
				  ))
				: simpleRows.map((row, rowIndex) => (
						<tr
							key={`table-row-${rowIndex}`}
							className="transition-colors duration-200 hover:bg-(--surface-hover)"
						>
							{(headers ?? []).map((_, colIndex) => (
								<td
									key={`table-cell-${rowIndex}-${colIndex}`}
									className="px-5 py-4 text-center align-middle first:text-left"
								>
									<Text
										as="span"
										variant="tableCell"
										size="sm"
									>
										{row[colIndex] ?? null}
									</Text>
								</td>
							))}
						</tr>
				  ))}
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
	);
};

export default TableBody;
