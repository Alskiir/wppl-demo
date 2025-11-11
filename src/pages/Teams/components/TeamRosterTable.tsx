import { useMemo } from "react";
import { Table } from "../../../components";
import type { TeamRosterEntry } from "../types";

const tableHeaders = ["Player", "Role", "Email", "Phone"];

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
				];
			}),
		[roster]
	);

	return <Table headers={tableHeaders} data={tableData} />;
}

function formatFullName(firstName?: string | null, lastName?: string | null) {
	const first = firstName?.trim() ?? "";
	const last = lastName?.trim() ?? "";
	const combined = `${first} ${last}`.trim();
	return combined.length ? combined : "Unknown Player";
}

export default TeamRosterTable;
