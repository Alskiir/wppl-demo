import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Table, Text, type TableColumn } from "../../../components";
import { DEFAULT_TABLE_PAGE_SIZE } from "../../../constants/pagination";
import type { TeamRosterEntry } from "../types";
import {
	buildFullName,
	formatBirthday,
	formatRoleLabel,
	normalizeRoleValue,
} from "../utils/rosterFormat";
import { downloadRosterCsv, downloadRosterPdf } from "../utils/exportRoster";

type TeamRosterTableProps = {
	roster: TeamRosterEntry[];
	teamName?: string;
};

const compareStrings = (a: string, b: string) =>
	a.localeCompare(b, undefined, { sensitivity: "base" });

const parseBirthdayTimestamp = (entry: TeamRosterEntry) => {
	const value = entry.person.birthday;
	if (!value) return Number.NEGATIVE_INFINITY;
	const parsed = Date.parse(value);
	return Number.isFinite(parsed) ? parsed : Number.NEGATIVE_INFINITY;
};

const copyTextToClipboard = async (value: string) => {
	if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
		await navigator.clipboard.writeText(value);
		return;
	}

	if (typeof document === "undefined") {
		return;
	}

	const textarea = document.createElement("textarea");
	textarea.value = value;
	textarea.style.position = "fixed";
	textarea.style.top = "-9999px";
	document.body.appendChild(textarea);
	textarea.focus();
	textarea.select();
	document.execCommand("copy");
	document.body.removeChild(textarea);
};

const buildTelHref = (value: string) => {
	const cleaned = value.replace(/[^\d+]/g, "");
	return `tel:${cleaned}`;
};

const CopyIcon = ({ className }: { className?: string }) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		className={className}
	>
		<rect
			x="9"
			y="9"
			width="10"
			height="12"
			rx="2"
			stroke="currentColor"
			strokeWidth="1.7"
		/>
		<path
			d="M5 15V5a2 2 0 0 1 2-2h10"
			stroke="currentColor"
			strokeWidth="1.7"
			strokeLinecap="round"
		/>
	</svg>
);

const MailIcon = ({ className }: { className?: string }) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		className={className}
	>
		<rect
			x="3"
			y="5"
			width="18"
			height="14"
			rx="2"
			stroke="currentColor"
			strokeWidth="1.7"
		/>
		<path
			d="M4 7.5 12 13l8-5.5"
			stroke="currentColor"
			strokeWidth="1.7"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

const PhoneIcon = ({ className }: { className?: string }) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		className={className}
	>
		<path
			d="M7 3h2.5l1.5 6-2 1.5c1.1 2.1 2.9 3.9 5 5l1.5-2 6 1.5V21c0 1.1-.9 2-2 2C9.611 23 1 14.389 1 4c0-1.1.9-2 2-2h4z"
			stroke="currentColor"
			strokeWidth="1.7"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

type ContactCellProps = {
	value?: string | null;
	type: "email" | "phone";
	onCopy: (value: string) => void;
	copiedValue: string | null;
};

const ContactCell = ({
	value,
	type,
	onCopy,
	copiedValue,
}: ContactCellProps) => {
	const resolvedValue = value?.trim();
	if (!resolvedValue) {
		return <span className="text-(--text-muted)">-</span>;
	}

	const iconClass = "h-4 w-4";
	const isEmail = type === "email";
	const actionLabel = isEmail ? "Email" : "Call";
	const href = isEmail
		? `mailto:${resolvedValue}`
		: buildTelHref(resolvedValue);
	const Icon = isEmail ? MailIcon : PhoneIcon;
	const isCopied = copiedValue === resolvedValue;

	return (
		<div className="flex flex-col items-center gap-2 text-center">
			<span className="break-all text-sm font-medium text-(--text-primary)">
				{resolvedValue}
			</span>
			<div className="flex flex-wrap items-center justify-center gap-2">
				<a
					href={href}
					className="md-outlined-button md-button--compact inline-flex items-center gap-2 text-xs"
					style={{
						padding: "0.35rem 0.9rem",
						minHeight: "unset",
						fontSize: "0.75rem",
					}}
				>
					<Icon className={iconClass} aria-hidden="true" />
					<span>{actionLabel}</span>
				</a>
				<button
					type="button"
					onClick={() => onCopy(resolvedValue)}
					className={`copy-button inline-flex items-center gap-1 rounded-full border border-(--border-subtle) px-3 py-1 text-xs font-semibold transition-colors ${
						isCopied ? "copy-button--success" : ""
					}`}
				>
					<CopyIcon className={iconClass} aria-hidden="true" />
					<span>Copy</span>
					<span
						className={`copy-button__toast ${
							isCopied ? "copy-button__toast--visible" : ""
						}`}
						aria-hidden="true"
					>
						Copied!
					</span>
					<span className="sr-only" aria-live="polite">
						{isCopied ? "Copied to clipboard" : "Copy address"}
					</span>
				</button>
			</div>
		</div>
	);
};

function TeamRosterTable({ roster, teamName }: TeamRosterTableProps) {
	const [roleFilter, setRoleFilter] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [copiedValue, setCopiedValue] = useState<string | null>(null);
	const copyTimeoutRef = useRef<number | null>(null);
	const canExportRoster = roster.length > 0;

	const handleExport = useCallback(
		(format: "csv" | "pdf") => {
			if (!canExportRoster) {
				return;
			}
			if (format === "csv") {
				downloadRosterCsv(roster, teamName);
			} else {
				downloadRosterPdf(roster, teamName);
			}
		},
		[canExportRoster, roster, teamName]
	);

	const handleCopyValue = useCallback(async (value: string) => {
		if (!value) {
			return;
		}
		try {
			await copyTextToClipboard(value);
			setCopiedValue(value);
			if (typeof window !== "undefined") {
				if (copyTimeoutRef.current) {
					window.clearTimeout(copyTimeoutRef.current);
				}
				copyTimeoutRef.current = window.setTimeout(
					() => setCopiedValue(null),
					2000
				);
			}
		} catch {
			// Ignore clipboard failures and keep the UI responsive.
		}
	}, []);

	useEffect(() => {
		return () => {
			if (
				typeof window !== "undefined" &&
				copyTimeoutRef.current !== null
			) {
				window.clearTimeout(copyTimeoutRef.current);
			}
		};
	}, []);

	const roleOptions = useMemo(() => {
		const uniqueRoles = new Set<string>();
		roster.forEach((entry) => {
			const normalized = normalizeRoleValue(entry.role);
			if (normalized) {
				uniqueRoles.add(normalized);
			}
		});

		return Array.from(uniqueRoles)
			.map((value) => ({
				value,
				label: formatRoleLabel(value),
			}))
			.sort((a, b) => compareStrings(a.label, b.label));
	}, [roster]);

	const filteredRoster = useMemo(() => {
		const normalizedSearch = searchQuery.trim().toLowerCase();
		return roster.filter((entry) => {
			const normalizedRole = normalizeRoleValue(entry.role);
			if (roleFilter && normalizedRole !== roleFilter) {
				return false;
			}

			if (!normalizedSearch) {
				return true;
			}

			const fullName = buildFullName(entry).toLowerCase();
			const email = (entry.person.email ?? "").toLowerCase();
			const phone = (entry.person.phone_mobile ?? "").toLowerCase();
			const roleLabel = formatRoleLabel(entry.role).toLowerCase();

			return (
				fullName.includes(normalizedSearch) ||
				email.includes(normalizedSearch) ||
				phone.includes(normalizedSearch) ||
				roleLabel.includes(normalizedSearch)
			);
		});
	}, [roster, roleFilter, searchQuery]);

	const hasActiveFilters =
		Boolean(roleFilter) || Boolean(searchQuery.trim().length);

	const columns = useMemo<TableColumn<TeamRosterEntry>[]>(() => {
		return [
			{
				id: "player",
				header: "Player",
				align: "left",
				accessor: (entry) => buildFullName(entry),
				sortFn: (a, b) =>
					compareStrings(buildFullName(a), buildFullName(b)),
			},
			{
				id: "role",
				header: "Role",
				align: "center",
				accessor: (entry) => formatRoleLabel(entry.role),
				sortFn: (a, b) =>
					compareStrings(
						formatRoleLabel(a.role),
						formatRoleLabel(b.role)
					),
			},
			{
				id: "email",
				header: "Email",
				align: "center",
				accessor: (entry) => (
					<ContactCell
						value={entry.person.email}
						type="email"
						onCopy={handleCopyValue}
						copiedValue={copiedValue}
					/>
				),
				sortFn: (a, b) =>
					compareStrings(a.person.email ?? "", b.person.email ?? ""),
			},
			{
				id: "phone",
				header: "Phone",
				align: "center",
				accessor: (entry) => (
					<ContactCell
						value={entry.person.phone_mobile}
						type="phone"
						onCopy={handleCopyValue}
						copiedValue={copiedValue}
					/>
				),
				sortFn: (a, b) =>
					compareStrings(
						a.person.phone_mobile ?? "",
						b.person.phone_mobile ?? ""
					),
			},
			{
				id: "birthday",
				header: "Birthday",
				align: "center",
				accessor: (entry) => formatBirthday(entry.person.birthday),
				sortFn: (a, b) =>
					parseBirthdayTimestamp(a) - parseBirthdayTimestamp(b),
			},
		];
	}, [copiedValue, handleCopyValue]);

	const toolbarContent = (
		<div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
			<div className="flex flex-col gap-4 md:max-w-3xl md:flex-row md:items-end">
				<label className="flex flex-1 flex-col gap-2">
					<span className="md-field-label">Search roster</span>
					<input
						type="text"
						placeholder="Search by player, email, or phone"
						value={searchQuery}
						onChange={(event) => setSearchQuery(event.target.value)}
						className="md-input md-input--compact"
					/>
				</label>
				<label className="flex w-full flex-col gap-2 md:w-60">
					<span className="md-field-label">Role</span>
					<select
						value={roleFilter}
						onChange={(event) => setRoleFilter(event.target.value)}
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
						disabled={!canExportRoster}
						onClick={() => handleExport("csv")}
					>
						Export CSV
					</button>
					<button
						type="button"
						className="md-filled-button md-button--compact text-xs disabled:opacity-50"
						disabled={!canExportRoster}
						onClick={() => handleExport("pdf")}
					>
						Export PDF
					</button>
				</div>
				<div className="flex flex-wrap items-center gap-3">
					<Text as="p" variant="muted" size="xs">
						Showing {filteredRoster.length} of {roster.length}{" "}
						contacts
					</Text>
					{hasActiveFilters ? (
						<button
							type="button"
							onClick={() => {
								setSearchQuery("");
								setRoleFilter("");
							}}
							className="text-xs font-semibold text-(--accent) underline-offset-2 hover:text-(--accent-strong)"
						>
							Clear filters
						</button>
					) : null}
				</div>
			</div>
		</div>
	);

	return (
		<Table
			columns={columns}
			data={filteredRoster}
			pageSize={DEFAULT_TABLE_PAGE_SIZE}
			getRowId={(row, index) => row.person.id ?? index}
			initialSortColumnId="player"
			initialSortDirection="asc"
			emptyMessage={
				hasActiveFilters
					? "No players match the current filters."
					: "No players found on this roster."
			}
			toolbar={toolbarContent}
			toolbarClassName="px-4 py-4 md:px-6 md:py-5"
		/>
	);
}

export default TeamRosterTable;
