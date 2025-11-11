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
		<div
			className={`overflow-hidden rounded-2xl border border-neutral-200 bg-white/90 shadow-xl backdrop-blur ${className}`}
		>
			<div className="overflow-x-auto">
				<table className="table-auto min-w-full">
					<thead className="bg-linear-to-r from-neutral-900 via-neutral-800 to-neutral-900">
						<tr>
							{headers.map((header, index) => (
								<th
									key={`table-header-${index}`}
									className="px-6 py-4 text-center first:rounded-tl-2xl last:rounded-tr-2xl"
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
					<tbody className="divide-y divide-neutral-100 bg-white">
						{data.map((row, rowIndex) => (
							<tr
								key={`table-row-${rowIndex}`}
								className="odd:bg-white even:bg-neutral-50/60 transition-colors duration-200 hover:bg-sky-50"
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
