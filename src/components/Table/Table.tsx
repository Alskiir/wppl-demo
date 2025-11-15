import { Text } from "../Typography";
import TableBody from "./components/TableBody";
import TableHeader from "./components/TableHeader";
import TablePagination from "./components/TablePagination";
import { columnHasHint, headerNodeHasHint } from "./headerUtils";
import { useTablePagination } from "./hooks/useTablePagination";
import { useTableSorting } from "./hooks/useTableSorting";
import type {
	ColumnDrivenTableProps,
	SimpleTableProps,
	TableColumn,
	TableProps,
	TableRow,
} from "./types";

const defaultEmptyMessage = (
	<Text variant="caption" size="sm">
		No data available.
	</Text>
);

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
	const hasAnyHeaderHints = hasColumnDefinitions
		? resolvedColumns.some((column) => columnHasHint(column))
		: (headers ?? []).some((header) => headerNodeHasHint(header));
	const headerMinHeightStyle = hasAnyHeaderHints
		? { minHeight: "65px" }
		: undefined;

	const { sortState, sortedData, handleSortClick } = useTableSorting({
		data: rawData,
		columns: resolvedColumns,
		hasColumnDefinitions,
		initialSortColumnId,
		initialSortDirection,
		onSortChange,
	});

	const {
		paginatedData,
		showPagination,
		rangeStart,
		rangeEnd,
		totalPages,
		safePage,
		setCurrentPage,
	} = useTablePagination({
		data: sortedData,
		pageSize,
	});

	const hasRows = paginatedData.length > 0;
	const showEmptyState = !isLoading && !hasRows;
	const getRowId =
		(rest as ColumnDrivenTableProps<T>).getRowId ??
		((_, index: number) => index);
	const goToPreviousPage = () =>
		setCurrentPage((prev) => Math.max(prev - 1, 0));
	const goToNextPage = () =>
		setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
	const resolvedClassName = ["md-card overflow-hidden", className]
		.filter(Boolean)
		.join(" ");

	return (
		<div className={resolvedClassName}>
			<div className="overflow-x-auto">
				<table className="min-w-full table-auto text-sm text-(--text-primary)">
					<TableHeader
						columns={resolvedColumns}
						headers={headers}
						hasColumnDefinitions={hasColumnDefinitions}
						sortState={sortState}
						onSort={handleSortClick}
						headerMinHeightStyle={headerMinHeightStyle}
					/>
					<TableBody
						hasColumnDefinitions={hasColumnDefinitions}
						columns={resolvedColumns}
						columnRows={paginatedData}
						simpleRows={paginatedData as unknown as TableRow[]}
						headers={headers}
						columnCount={columnCount}
						emptyMessage={emptyMessage}
						isLoading={isLoading}
						skeletonRowCount={skeletonRowCount}
						showEmptyState={showEmptyState}
						getRowId={getRowId}
					/>
				</table>
			</div>
			{showPagination ? (
				<TablePagination
					rangeStart={rangeStart}
					rangeEnd={rangeEnd}
					totalItems={sortedData.length}
					onPrevious={goToPreviousPage}
					onNext={goToNextPage}
					disablePrevious={safePage === 0}
					disableNext={safePage >= totalPages - 1}
				/>
			) : null}
		</div>
	);
};

export type { TableRow, TableColumn, TableProps, SortDirection } from "./types";

export default Table;
