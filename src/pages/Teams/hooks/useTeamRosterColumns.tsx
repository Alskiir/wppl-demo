import { useMemo } from "react";
import type { TableColumn } from "../../../components";
import type { TeamRosterEntry } from "../types";
import ContactCell from "../components/ContactCell";
import {
	buildFullName,
	formatBirthday,
	formatRoleLabel,
} from "../utils/rosterFormat";

const compareStrings = (a: string, b: string) =>
	a.localeCompare(b, undefined, { sensitivity: "base" });

const parseBirthdayTimestamp = (entry: TeamRosterEntry) => {
	const value = entry.person.birthday;
	if (!value) return Number.NEGATIVE_INFINITY;
	const parsed = Date.parse(value);
	return Number.isFinite(parsed) ? parsed : Number.NEGATIVE_INFINITY;
};

type UseTeamRosterColumnsParams = {
	copiedValue: string | null;
	onCopyValue: (value: string) => void;
};

export const useTeamRosterColumns = ({
	copiedValue,
	onCopyValue,
}: UseTeamRosterColumnsParams) => {
	return useMemo<TableColumn<TeamRosterEntry>[]>(() => {
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
						onCopy={onCopyValue}
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
						onCopy={onCopyValue}
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
	}, [copiedValue, onCopyValue]);
};
