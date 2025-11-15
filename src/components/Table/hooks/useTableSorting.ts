import { useEffect, useMemo, useState } from "react";
import type { SortDirection, SortState, TableColumn } from "../types";

type UseTableSortingOptions<T> = {
	data: T[];
	columns: TableColumn<T>[];
	hasColumnDefinitions: boolean;
	initialSortColumnId?: string;
	initialSortDirection: SortDirection;
	onSortChange?: (state: SortState | null) => void;
};

type UseTableSortingResult<T> = {
	sortState: SortState | null;
	sortedData: T[];
	handleSortClick: (columnId: string) => void;
};

const findFirstSortableColumnId = <T>(columns: TableColumn<T>[]) =>
	columns.find((column) => typeof column.sortFn === "function")?.id ?? null;

export const useTableSorting = <T>({
	data,
	columns,
	hasColumnDefinitions,
	initialSortColumnId,
	initialSortDirection,
	onSortChange,
}: UseTableSortingOptions<T>): UseTableSortingResult<T> => {
	const firstSortableColumnId = hasColumnDefinitions
		? findFirstSortableColumnId(columns)
		: null;

	const resolvedInitialColumnId =
		hasColumnDefinitions &&
		initialSortColumnId &&
		columns.some(
			(column) =>
				column.id === initialSortColumnId &&
				typeof column.sortFn === "function"
		)
			? initialSortColumnId
			: firstSortableColumnId;

	const resolvedInitialDirection =
		initialSortColumnId && resolvedInitialColumnId === initialSortColumnId
			? initialSortDirection
			: "asc";

	const [sortState, setSortState] = useState<SortState | null>(() =>
		hasColumnDefinitions && resolvedInitialColumnId
			? {
					columnId: resolvedInitialColumnId,
					direction: resolvedInitialDirection,
			  }
			: null
	);

	useEffect(() => {
		if (!hasColumnDefinitions) {
			setSortState(null);
			return;
		}

		setSortState((previous) => {
			if (
				previous &&
				columns.some(
					(column) =>
						column.id === previous.columnId &&
						typeof column.sortFn === "function"
				)
			) {
				return previous;
			}

			if (!resolvedInitialColumnId) {
				return null;
			}

			return {
				columnId: resolvedInitialColumnId,
				direction: resolvedInitialDirection,
			};
		});
	}, [
		columns,
		hasColumnDefinitions,
		resolvedInitialColumnId,
		resolvedInitialDirection,
	]);

	const sortedData = useMemo(() => {
		if (!hasColumnDefinitions || !sortState) {
			return data;
		}

		const targetColumn = columns.find(
			(column) => column.id === sortState.columnId
		);

		if (!targetColumn || typeof targetColumn.sortFn !== "function") {
			return data;
		}

		const modifier = sortState.direction === "asc" ? 1 : -1;
		const dataCopy = [...data];

		dataCopy.sort((a, b) => modifier * targetColumn.sortFn!(a, b));
		return dataCopy;
	}, [columns, data, hasColumnDefinitions, sortState]);

	const handleSortClick = (columnId: string) => {
		if (!hasColumnDefinitions) return;
		const targetColumn = columns.find((column) => column.id === columnId);
		if (!targetColumn || typeof targetColumn.sortFn !== "function") {
			return;
		}

		setSortState((previous) => {
			const direction =
				previous?.columnId === columnId && previous.direction === "asc"
					? "desc"
					: "asc";
			const nextState: SortState = {
				columnId,
				direction: previous?.columnId === columnId ? direction : "asc",
			};
			onSortChange?.(nextState);
			return nextState;
		});
	};

	return { sortState, sortedData, handleSortClick };
};
