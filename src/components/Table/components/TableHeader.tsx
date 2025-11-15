import type { CSSProperties, ReactNode } from "react";
import {
	alignmentClassMap,
	headerJustifyClassMap,
	headerPaddingClasses,
	renderHeaderContent,
	type ColumnAlignment,
} from "../headerUtils";
import type { SortState, TableColumn } from "../types";

type TableHeaderProps<T> = {
	columns: TableColumn<T>[];
	headers?: ReactNode[];
	hasColumnDefinitions: boolean;
	sortState: SortState | null;
	onSort: (columnId: string) => void;
	headerMinHeightStyle?: CSSProperties;
};

const TableHeader = <T,>({
	columns,
	headers,
	hasColumnDefinitions,
	sortState,
	onSort,
	headerMinHeightStyle,
}: TableHeaderProps<T>) => (
	<thead className="bg-(--surface-panel)">
		<tr>
			{hasColumnDefinitions && columns.length
				? columns.map((column, index) => {
						const canSort = typeof column.sortFn === "function";
						const isActive = sortState?.columnId === column.id;
						const direction = isActive
							? sortState?.direction
							: null;
						const alignment: ColumnAlignment =
							column.align ?? (index === 0 ? "left" : "center");
						const headerContent = renderHeaderContent(
							column.header,
							alignment,
							column.headerHint
						);
						const headerJustifyClass =
							headerJustifyClassMap[alignment];

						return (
							<th
								key={column.id}
								className={`p-0 ${
									alignmentClassMap[alignment]
								} ${column.headerClassName ?? ""}`}
								scope="col"
								aria-sort={
									canSort
										? isActive
											? direction === "asc"
												? "ascending"
												: "descending"
											: "none"
										: undefined
								}
							>
								{canSort ? (
									<button
										type="button"
										onClick={() => onSort(column.id)}
										className={`group relative flex h-full w-full items-center ${headerPaddingClasses} font-semibold text-(--text-primary) transition-colors duration-150 hover:bg-(--surface-hover) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)`}
										aria-pressed={Boolean(isActive)}
										style={headerMinHeightStyle}
									>
										<span
											className={`flex w-full items-center ${headerJustifyClass}`}
										>
											{headerContent}
										</span>
										<span
											aria-hidden="true"
											className="pointer-events-none absolute right-4 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center text-[0.8rem] text-(--text-muted)"
										>
											<span
												className={`transition-opacity duration-150 ${
													direction
														? "opacity-100"
														: "opacity-0"
												}`}
											>
												{direction === "desc"
													? "v"
													: "^"}
											</span>
										</span>
									</button>
								) : (
									<span
										className={`flex w-full items-center ${headerJustifyClass} ${headerPaddingClasses}`}
										style={headerMinHeightStyle}
									>
										{headerContent}
									</span>
								)}
							</th>
						);
				  })
				: headers?.map((header, index) => {
						const alignment: ColumnAlignment =
							index === 0 ? "left" : "center";
						return (
							<th
								key={`table-header-${index}`}
								className={`p-0 ${alignmentClassMap[alignment]}`}
								scope="col"
							>
								<span
									className={`flex w-full items-center ${headerJustifyClassMap[alignment]} ${headerPaddingClasses}`}
									style={headerMinHeightStyle}
								>
									{renderHeaderContent(header, alignment)}
								</span>
							</th>
						);
				  })}
		</tr>
	</thead>
);

export default TableHeader;
