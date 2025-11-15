import type { MatchHistoryEntry, MatchLinePlayer } from "../../types";

export const formatDateLabel = (dateString: string) => {
	if (!dateString) return "TBD";

	const [year, month, day] = dateString.split("-").map(Number);
	if (
		[year, month, day].some(
			(part) => typeof part !== "number" || Number.isNaN(part)
		)
	) {
		return dateString;
	}

	const date = new Date(Date.UTC(year, (month ?? 1) - 1, day));

	return new Intl.DateTimeFormat(undefined, {
		month: "short",
		day: "numeric",
		year: "numeric",
		timeZone: "UTC",
	}).format(date);
};

export const formatTimeLabel = (timeString: string | null) => {
	if (!timeString) return null;
	const [rawHours, rawMinutes] = timeString.split(":");
	const hours = Number(rawHours);
	const minutes = Number(rawMinutes);

	if (
		!Number.isFinite(hours) ||
		!Number.isFinite(minutes) ||
		hours < 0 ||
		minutes < 0
	) {
		return timeString;
	}

	const date = new Date(Date.UTC(1970, 0, 1, hours, minutes));

	return new Intl.DateTimeFormat(undefined, {
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
		timeZone: "UTC",
	}).format(date);
};

export const formatScoreValue = (value: number | null) =>
	typeof value === "number" && Number.isFinite(value) ? value : "-";

export const formatPlayerNames = (players: MatchLinePlayer[]) => {
	const names = players.map((player) => player.fullName).filter(Boolean);
	return names.length ? names.join(" & ") : "Players TBD";
};

export const getMatchTimestamp = (row: MatchHistoryEntry) => {
	const [year, month, day] = row.matchDate?.split("-").map(Number) ?? [];
	const [hours, minutes] = row.matchTime?.split(":").map(Number) ?? [];

	if (
		!Number.isFinite(year) ||
		!Number.isFinite(month) ||
		!Number.isFinite(day)
	) {
		return 0;
	}

	const normalizedHours = Number.isFinite(hours) ? hours : 0;
	const normalizedMinutes = Number.isFinite(minutes) ? minutes : 0;

	return Date.UTC(
		year!,
		(month ?? 1) - 1,
		day!,
		normalizedHours,
		normalizedMinutes
	);
};

export const compareText = (a?: string | null, b?: string | null) => {
	const aValue = a?.toLowerCase().trim() ?? "";
	const bValue = b?.toLowerCase().trim() ?? "";
	return aValue.localeCompare(bValue);
};
