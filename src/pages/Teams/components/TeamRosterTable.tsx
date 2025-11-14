import { useMemo } from "react";
import { Table, type TableColumn } from "../../../components";
import { formatFullName } from "../../../utils/dataTransforms";
import type { TeamRosterEntry } from "../types";

const ROLE_LABELS: Record<string, string> = {
	captain: "Captain",
	co_captain: "Co-captain",
	"co-captain": "Co-captain",
};

const formatRoleLabel = (role?: string | null) => {
	const normalized = role?.trim();
	if (!normalized) {
		return "-";
	}

	const match = ROLE_LABELS[normalized.toLowerCase()];
	if (match) {
		return match;
	}

	return normalized
		.split(/[_\s-]+/)
		.filter(Boolean)
		.map(
			(part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
		)
		.join(" ");
};

const formatBirthday = (birthday?: string | null) => {
	const trimmed = birthday?.trim();
	if (!trimmed) {
		return "-";
	}

	const isoMatch = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
	if (isoMatch) {
		const [, yearRaw, monthRaw, dayRaw] = isoMatch;
		const year = Number(yearRaw);
		const month = Number(monthRaw);
		const day = Number(dayRaw);

		if (
			Number.isFinite(year) &&
			Number.isFinite(month) &&
			Number.isFinite(day)
		) {
			const date = new Date(Date.UTC(year, month - 1, day));
			return new Intl.DateTimeFormat(undefined, {
				month: "short",
				day: "numeric",
				year: "numeric",
				timeZone: "UTC",
			}).format(date);
		}
	}

	const parsed = Date.parse(trimmed);
	if (Number.isNaN(parsed)) {
		return trimmed;
	}

	return new Intl.DateTimeFormat(undefined, {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(new Date(parsed));
};

type TeamRosterTableProps = {
	roster: TeamRosterEntry[];
};

const buildFullName = (entry: TeamRosterEntry) =>
	formatFullName(entry.person.first_name, entry.person.last_name);

const compareStrings = (a: string, b: string) =>
	a.localeCompare(b, undefined, { sensitivity: "base" });

const parseBirthdayTimestamp = (entry: TeamRosterEntry) => {
	const value = entry.person.birthday;
	if (!value) return Number.NEGATIVE_INFINITY;
	const parsed = Date.parse(value);
	return Number.isFinite(parsed) ? parsed : Number.NEGATIVE_INFINITY;
};

function TeamRosterTable({ roster }: TeamRosterTableProps) {
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
				accessor: (entry) => entry.person.email ?? "-",
				sortFn: (a, b) =>
					compareStrings(a.person.email ?? "", b.person.email ?? ""),
			},
			{
				id: "phone",
				header: "Phone",
				align: "center",
				accessor: (entry) => entry.person.phone_mobile ?? "-",
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
	}, []);

	return (
		<Table
			columns={columns}
			data={roster}
			getRowId={(row, index) => row.person.id ?? index}
			initialSortColumnId="player"
			initialSortDirection="asc"
			emptyMessage="No players found on this roster."
		/>
	);
}

export default TeamRosterTable;
