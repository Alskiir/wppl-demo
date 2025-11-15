import type React from "react";

export type TableRow = Array<React.ReactNode>;
export type SortDirection = "asc" | "desc";

export type TableColumn<T> = {
	id: string;
	header: React.ReactNode;
	headerHint?: string;
	accessor: (row: T, rowIndex: number) => React.ReactNode;
	sortFn?: (a: T, b: T) => number;
	align?: "left" | "center" | "right";
	className?: string;
	headerClassName?: string;
};

export type SortState = {
	columnId: string;
	direction: SortDirection;
};

type BaseTableProps = {
	className?: string;
	isLoading?: boolean;
	skeletonRowCount?: number;
	emptyMessage?: React.ReactNode;
	toolbar?: React.ReactNode;
	toolbarClassName?: string;
	pageSize?: number;
	initialSortColumnId?: string;
	initialSortDirection?: SortDirection;
	onSortChange?: (state: SortState | null) => void;
};

export type ColumnDrivenTableProps<T> = BaseTableProps & {
	columns: TableColumn<T>[];
	data: T[];
	headers?: never;
	getRowId?: (row: T, index: number) => string | number | undefined;
};

export type SimpleTableProps = BaseTableProps & {
	headers: React.ReactNode[];
	data: TableRow[];
	columns?: undefined;
};

export type TableProps<T = TableRow> =
	| ColumnDrivenTableProps<T>
	| SimpleTableProps;
