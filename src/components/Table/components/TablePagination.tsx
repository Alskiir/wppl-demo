type TablePaginationProps = {
	rangeStart: number;
	rangeEnd: number;
	totalItems: number;
	onPrevious: () => void;
	onNext: () => void;
	disablePrevious: boolean;
	disableNext: boolean;
};

const TablePagination = ({
	rangeStart,
	rangeEnd,
	totalItems,
	onPrevious,
	onNext,
	disablePrevious,
	disableNext,
}: TablePaginationProps) => (
	<div className="flex flex-col gap-3 border-t border-(--border-subtle) bg-(--surface-panel) px-4 py-4 text-sm text-(--text-muted) md:flex-row md:items-center md:justify-between">
		<span>
			Showing {rangeStart}-{rangeEnd} of {totalItems}
		</span>
		<div className="flex gap-2">
			<button
				type="button"
				onClick={onPrevious}
				disabled={disablePrevious}
				className="md-outlined-button text-xs disabled:opacity-50"
			>
				Previous
			</button>
			<button
				type="button"
				onClick={onNext}
				disabled={disableNext}
				className="md-outlined-button text-xs disabled:opacity-50"
			>
				Next
			</button>
		</div>
	</div>
);

export default TablePagination;
