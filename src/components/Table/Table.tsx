import React from "react";
import { Text } from "../Typography";

type TableRow = Array<React.ReactNode>;

interface TableProps {
	headers: React.ReactNode[];
	data: TableRow[];
	className?: string;
}

const Table: React.FC<TableProps> = ({ headers, data, className = "" }) => {
	return (
		<div className={`md-card overflow-hidden ${className}`}>
			<div className="overflow-x-auto">
				<table className="min-w-full table-auto text-sm text-(--text-primary)">
					<thead className="bg-(--surface-panel)">
						<tr>
							{headers.map((header, index) => (
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
						{data.map((row, rowIndex) => (
							<tr
								key={`table-row-${rowIndex}`}
								className="transition-colors duration-200 hover:bg-(--surface-hover)"
							>
								{headers.map((_, colIndex) => (
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
						{data.length === 0 ? (
							<tr>
								<td
									colSpan={Math.max(headers.length, 1)}
									className="px-6 py-6 text-center"
								>
									<Text variant="caption" size="sm">
										No data available.
									</Text>
								</td>
							</tr>
						) : null}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Table;
