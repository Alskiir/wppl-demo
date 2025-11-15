import type { Dispatch, SetStateAction } from "react";
import { Text } from "../../../components";
import type { RoleFilterOption } from "../hooks/useTeamRosterFilters";

type TeamRosterToolbarProps = {
	searchQuery: string;
	roleFilter: string;
	roleOptions: RoleFilterOption[];
	onSearchChange: Dispatch<SetStateAction<string>>;
	onRoleFilterChange: Dispatch<SetStateAction<string>>;
	filteredCount: number;
	totalCount: number;
	hasActiveFilters: boolean;
	onClearFilters: () => void;
	canExport: boolean;
	onExportCsv: () => void;
	onExportPdf: () => void;
};

const TeamRosterToolbar = ({
	searchQuery,
	roleFilter,
	roleOptions,
	onSearchChange,
	onRoleFilterChange,
	filteredCount,
	totalCount,
	hasActiveFilters,
	onClearFilters,
	canExport,
	onExportCsv,
	onExportPdf,
}: TeamRosterToolbarProps) => {
	return (
		<div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
			<div className="flex flex-col gap-4 md:max-w-3xl md:flex-row md:items-end">
				<label className="flex flex-1 flex-col gap-2">
					<span className="md-field-label">Search roster</span>
					<input
						type="text"
						placeholder="Search by player, email, or phone"
						value={searchQuery}
						onChange={(event) => onSearchChange(event.target.value)}
						className="md-input md-input--compact"
					/>
				</label>
				<label className="flex w-full flex-col gap-2 md:w-60">
					<span className="md-field-label">Role</span>
					<select
						value={roleFilter}
						onChange={(event) =>
							onRoleFilterChange(event.target.value)
						}
						className="md-input md-input--compact md-select"
					>
						<option value="">All roles</option>
						{roleOptions.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</label>
			</div>
			<div className="flex flex-col gap-6 md:items-end">
				<div className="flex not-md:flex-wrap gap-2">
					<button
						type="button"
						className="md-outlined-button md-button--compact text-xs disabled:opacity-50"
						disabled={!canExport}
						onClick={onExportCsv}
					>
						Export CSV
					</button>
					<button
						type="button"
						className="md-filled-button md-button--compact text-xs disabled:opacity-50"
						disabled={!canExport}
						onClick={onExportPdf}
					>
						Export PDF
					</button>
				</div>
				<div className="flex flex-wrap items-center gap-3">
					<Text as="p" variant="muted" size="xs">
						Showing {filteredCount} of {totalCount} contacts
					</Text>
					{hasActiveFilters ? (
						<button
							type="button"
							onClick={onClearFilters}
							className="text-xs font-semibold text-(--accent) underline-offset-2 hover:text-(--accent-strong)"
						>
							Clear filters
						</button>
					) : null}
				</div>
			</div>
		</div>
	);
};

export default TeamRosterToolbar;
