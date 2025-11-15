import { formatFullName } from "../../../utils/dataTransforms";
import type { TeamRosterEntry } from "../types";

const ROLE_LABELS: Record<string, string> = {
	captain: "Captain",
	co_captain: "Co-captain",
	"co-captain": "Co-captain",
};

const normalizeRoleValue = (role?: string | null) => {
	const normalized = role?.trim().toLowerCase();
	return normalized ?? "";
};

const formatRoleLabel = (role?: string | null) => {
	const normalized = normalizeRoleValue(role);
	if (!normalized) {
		return "-";
	}

	const match = ROLE_LABELS[normalized];
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

const buildFullName = (entry: TeamRosterEntry) =>
	formatFullName(entry.person.first_name, entry.person.last_name);

export { buildFullName, formatBirthday, formatRoleLabel, normalizeRoleValue };
