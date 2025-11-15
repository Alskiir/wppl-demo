import { useMemo, useState } from "react";
import type React from "react";

type UseTablePaginationOptions<T> = {
	data: T[];
	pageSize?: number;
};

type UseTablePaginationResult<T> = {
	normalizedPageSize?: number;
	paginatedData: T[];
	showPagination: boolean;
	rangeStart: number;
	rangeEnd: number;
	totalPages: number;
	safePage: number;
	setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
};

export const useTablePagination = <T>({
	data,
	pageSize,
}: UseTablePaginationOptions<T>): UseTablePaginationResult<T> => {
	const normalizedPageSize =
		typeof pageSize === "number" && pageSize > 0
			? Math.max(1, Math.floor(pageSize))
			: undefined;
	const [currentPage, setCurrentPage] = useState(0);

	const totalPages = normalizedPageSize
		? Math.max(1, Math.ceil(data.length / normalizedPageSize))
		: 1;
	const safePage = normalizedPageSize
		? Math.min(currentPage, totalPages - 1)
		: 0;

	const paginatedData = useMemo(() => {
		if (!normalizedPageSize) {
			return data;
		}

		const start = safePage * normalizedPageSize;
		return data.slice(start, start + normalizedPageSize);
	}, [data, normalizedPageSize, safePage]);

	const showPagination =
		normalizedPageSize !== undefined && data.length > normalizedPageSize;
	const rangeStart = normalizedPageSize
		? safePage * normalizedPageSize + 1
		: 1;
	const rangeEnd = normalizedPageSize
		? Math.min(data.length, (safePage + 1) * normalizedPageSize)
		: data.length;

	return {
		normalizedPageSize,
		paginatedData,
		showPagination,
		rangeStart,
		rangeEnd,
		totalPages,
		safePage,
		setCurrentPage,
	};
};
