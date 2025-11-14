import { useMemo } from "react";
import { Table } from "../../../components";
import { formatFullName } from "../../../utils/dataTransforms";
import type { TeamRosterEntry } from "../types";

const tableHeaders = ["Player", "Role", "Email", "Phone", "Birthday"];

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

function TeamRosterTable({ roster }: TeamRosterTableProps) {
	const tableData = useMemo(
		() =>
			roster.map((entry) => {
				const fullName = formatFullName(
					entry.person.first_name,
					entry.person.last_name
				);

				return [
					fullName,
					entry.role ?? "-",
					entry.person.email ?? "-",
					entry.person.phone_mobile ?? "-",
					formatBirthday(entry.person.birthday),
				];
			}),
		[roster]
	);

	return <Table headers={tableHeaders} data={tableData} />;
}

export default TeamRosterTable;
