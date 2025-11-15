import {
	useCallback,
	useMemo,
	useState,
	type Dispatch,
	type SetStateAction,
} from "react";
import type { TeamRosterEntry } from "../types";
import {
	buildFullName,
	formatRoleLabel,
	normalizeRoleValue,
} from "../utils/rosterFormat";

export type RoleFilterOption = {
	value: string;
	label: string;
};

const compareStrings = (a: string, b: string) =>
	a.localeCompare(b, undefined, { sensitivity: "base" });

type UseTeamRosterFiltersResult = {
	filteredRoster: TeamRosterEntry[];
	roleOptions: RoleFilterOption[];
	roleFilter: string;
	setRoleFilter: Dispatch<SetStateAction<string>>;
	searchQuery: string;
	setSearchQuery: Dispatch<SetStateAction<string>>;
	hasActiveFilters: boolean;
	clearFilters: () => void;
};

export const useTeamRosterFilters = (
	roster: TeamRosterEntry[]
): UseTeamRosterFiltersResult => {
	const [roleFilter, setRoleFilter] = useState("");
	const [searchQuery, setSearchQuery] = useState("");

	const roleOptions = useMemo<RoleFilterOption[]>(() => {
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

	const clearFilters = useCallback(() => {
		setRoleFilter("");
		setSearchQuery("");
	}, []);

	return {
		filteredRoster,
		roleOptions,
		roleFilter,
		setRoleFilter,
		searchQuery,
		setSearchQuery,
		hasActiveFilters,
		clearFilters,
	};
};
