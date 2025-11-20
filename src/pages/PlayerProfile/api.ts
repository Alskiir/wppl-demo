import { supabase } from "../../lib/supabaseClient";
import { resolveSupabase } from "../../lib/supabaseQuery";
import { formatFullName } from "../../utils/dataTransforms";
import type { SupabaseRelation } from "../../types/league";

type PersonRow = {
	id: string;
	first_name: string;
	last_name: string;
	preferred_name: string | null;
};

type TeamRow = {
	id: string;
	name: string;
	location: string | null;
};

type TeamMembershipRow = {
	team_id: string;
	start_date: string | null;
	end_date: string | null;
	team: SupabaseRelation<TeamRow>;
};

type MatchRow = {
	id: string;
	match_date: string | null;
	match_time: string | null;
	location: string | null;
	home_team_id: string;
	away_team_id: string;
	winner_team_id: string | null;
};

type LineGameRow = {
	id: string;
	game_number: number | null;
	home_score: number | null;
	away_score: number | null;
};

type PersonRelation = SupabaseRelation<PersonRow>;

export type RawPlayerLineRow = {
	id: string;
	match_id: string;
	line_number: number | null;
	winner_team_id: string | null;
	match: SupabaseRelation<MatchRow>;
	line_game: SupabaseRelation<LineGameRow>;
	home_player1: PersonRelation;
	home_player2: PersonRelation;
	away_player1: PersonRelation;
	away_player2: PersonRelation;
};

export type NormalizedPlayerLine = {
	id: string;
	matchId: string;
	matchDate: Date | null;
	matchLabel: string;
	matchLocation: string | null;
	playerTeamId: string;
	opponentTeamId: string;
	lineNumber: number;
	isHome: boolean;
	lineWin: boolean | null;
	games: {
		forScore: number;
		againstScore: number;
	}[];
	partner?: {
		id: string;
		fullName: string;
	};
};

type PlayerBasics = {
	playerId: string;
	fullName: string;
	handle: string;
	teamName: string;
	teamLocation: string;
	joinedLabel: string;
};

export type PartnerStats = {
	name: string;
	matches: number;
	wins: number;
	losses: number;
	winPct: number;
};

export type PlayerComputedStats = {
	basics: PlayerBasics;
	winPercentage: number;
	winStreak: number;
	totalMatches: number;
	gamesWon: number;
	gamesLost: number;
	linesWon: number;
	linesLost: number;
	linesPerMatch: number;
	avgPointDifferential: number;
	trend: { label: string; value: number }[];
	partner: PartnerStats | null;
};

const PLAYER_LINE_SELECTION = `
	id,
	match_id,
	line_number,
	winner_team_id,
	match:match_id (
		id,
		match_date,
		match_time,
		location,
		home_team_id,
		away_team_id,
		winner_team_id
	),
	line_game (
		id,
		game_number,
		home_score,
		away_score
	),
	home_player1:home_player1 ( id, first_name, last_name, preferred_name ),
	home_player2:home_player2 ( id, first_name, last_name, preferred_name ),
	away_player1:away_player1 ( id, first_name, last_name, preferred_name ),
	away_player2:away_player2 ( id, first_name, last_name, preferred_name )
`;

const PLAYER_BASICS_SELECTION = `
	id,
	first_name,
	last_name,
	preferred_name
`;

const MEMBERSHIP_SELECTION = `
	id,
	team_id,
	start_date,
	end_date,
	team:team_id (
		id,
		name,
		location
	)
`;

const parseNumber = (value: unknown): number | null => {
	if (typeof value === "number" && Number.isFinite(value)) {
		return value;
	}

	if (typeof value === "string") {
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : null;
	}

	return null;
};

const normalizeTimeOffset = (time: string): string => {
	if (!time) return time;
	if (time.endsWith("Z")) return time;

	const offsetMatch = time.match(/([+-]\d{2})(\d{2})?$/);
	if (!offsetMatch) return time;

	const [, hours, minutes] = offsetMatch;
	return time.replace(offsetMatch[0], `${hours}:${minutes ?? "00"}`);
};

const parseDateTime = (
	date: string | null,
	time: string | null
): Date | null => {
	if (!date) return null;

	// Supabase `timetz` values come back like "16:12:00+00", which isn't ISO
	// friendly. Normalize the offset and try a couple of parse strategies.
	if (time) {
		const normalizedTime = normalizeTimeOffset(time);
		const isoDateTimeString = `${date}T${normalizedTime}`;
		const parsedIso = new Date(isoDateTimeString);
		if (!Number.isNaN(parsedIso.valueOf())) return parsedIso;

		const fallback = new Date(`${date} ${time}`);
		if (!Number.isNaN(fallback.valueOf())) return fallback;
	}

	const parsedDateOnly = new Date(date);
	return Number.isNaN(parsedDateOnly.valueOf()) ? null : parsedDateOnly;
};

const normalizeRelation = <T>(relation: T | T[] | null): T | null => {
	if (!relation) return null;
	if (Array.isArray(relation)) {
		return relation.length ? relation[0]! : null;
	}
	return relation;
};

const normalizeToArray = <T>(relation: SupabaseRelation<T>): T[] => {
	if (!relation) return [];
	return Array.isArray(relation) ? relation : [relation];
};

const dedupeLinesByMatch = (
	lines: NormalizedPlayerLine[]
): NormalizedPlayerLine[] => {
	const byMatch = new Map<string, NormalizedPlayerLine>();

	for (const line of lines) {
		const existing = byMatch.get(line.matchId);
		if (!existing) {
			byMatch.set(line.matchId, line);
			continue;
		}

		// Prefer the earliest/primary line number for that match, and keep
		// whichever entry has a usable matchDate if one is missing.
		const existingLine = existing.lineNumber ?? Number.POSITIVE_INFINITY;
		const currentLine = line.lineNumber ?? Number.POSITIVE_INFINITY;

		if (!existing.matchDate && line.matchDate) {
			byMatch.set(line.matchId, line);
		} else if (currentLine < existingLine) {
			byMatch.set(line.matchId, line);
		}
	}

	return Array.from(byMatch.values());
};

export async function fetchPlayerBasics(
	playerId: string
): Promise<PlayerBasics> {
	const person = await resolveSupabase<PersonRow>(
		supabase
			.from("person")
			.select(PLAYER_BASICS_SELECTION)
			.eq("id", playerId)
			.single(),
		{ errorMessage: "Unable to load player details." }
	);

	const memberships = await resolveSupabase<TeamMembershipRow[]>(
		supabase
			.from("team_membership")
			.select(MEMBERSHIP_SELECTION)
			.eq("person_id", playerId)
			.order("start_date", { ascending: false })
			.limit(1),
		{ fallbackValue: [], errorMessage: "Unable to load team membership." }
	);

	const membership = memberships[0];
	const team = membership ? normalizeRelation(membership.team) : null;
	const fullName = formatFullName(person.first_name, person.last_name);
	const preferred = person.preferred_name?.trim();

	return {
		playerId,
		fullName,
		handle: preferred ? `@${preferred.toLowerCase()}` : `@${person.id}`,
		teamName: team?.name ?? "Independent player",
		teamLocation: team?.location ?? "Location unknown",
		joinedLabel: membership?.start_date
			? `Joined ${new Date(membership.start_date).getFullYear()}`
			: "Active",
	};
}

const formatMatchLabel = (matchDate: Date | null): string => {
	if (!matchDate) return "Recent";
	return new Intl.DateTimeFormat("en", {
		month: "short",
		day: "numeric",
	}).format(matchDate);
};

export async function fetchPlayerLines(
	playerId: string
): Promise<NormalizedPlayerLine[]> {
	const rows = await resolveSupabase<RawPlayerLineRow[]>(
		supabase
			.from("match_line")
			.select(PLAYER_LINE_SELECTION)
			.or(
				[
					`home_player1.eq.${playerId}`,
					`home_player2.eq.${playerId}`,
					`away_player1.eq.${playerId}`,
					`away_player2.eq.${playerId}`,
				].join(",")
			)
			.order("match_id", { ascending: true })
			.returns<RawPlayerLineRow[]>(),
		{
			fallbackValue: [],
			errorMessage: "Unable to load player match lines.",
		}
	);

	const playerIdString = String(playerId);

	const normalizedLines = rows.flatMap((row, index) => {
		const match = normalizeRelation(row.match);
		if (!match) return [];
		const matchDate = parseDateTime(match.match_date, match.match_time);
		const matchLabel = formatMatchLabel(matchDate) || `M-${index + 1}`;
		const lineNumber =
			typeof row.line_number === "number" &&
			Number.isFinite(row.line_number)
				? row.line_number
				: index + 1;

		const home1 = normalizeRelation(row.home_player1);
		const home2 = normalizeRelation(row.home_player2);
		const away1 = normalizeRelation(row.away_player1);
		const away2 = normalizeRelation(row.away_player2);

		const isHome =
			home1?.id === playerIdString || home2?.id === playerIdString;
		const hasAway =
			away1?.id === playerIdString || away2?.id === playerIdString;

		if (!isHome && !hasAway) {
			return [];
		}

		const playerTeamId = isHome ? match.home_team_id : match.away_team_id;
		const opponentTeamId = isHome ? match.away_team_id : match.home_team_id;

		const partner = isHome
			? home1?.id === playerIdString
				? home2
				: home1
			: away1?.id === playerIdString
			? away2
			: away1;
		const partnerIdentity =
			partner && partner.id
				? {
						id: String(partner.id),
						fullName: formatFullName(
							partner.first_name,
							partner.last_name
						),
				  }
				: undefined;

		const gamesArray = normalizeToArray(row.line_game);

		const games = gamesArray
			.map((game) => {
				const homeScore = parseNumber(game.home_score);
				const awayScore = parseNumber(game.away_score);

				if (homeScore === null || awayScore === null) {
					return null;
				}

				return {
					forScore: isHome ? homeScore : awayScore,
					againstScore: isHome ? awayScore : homeScore,
				};
			})
			.filter(
				(game): game is { forScore: number; againstScore: number } =>
					Boolean(game)
			);

		const normalized: NormalizedPlayerLine = {
			id: row.id,
			matchId: row.match_id,
			matchDate,
			matchLabel,
			matchLocation: match.location ?? null,
			playerTeamId: String(playerTeamId),
			opponentTeamId: String(opponentTeamId),
			lineNumber,
			isHome,
			lineWin: row.winner_team_id
				? String(row.winner_team_id) === String(playerTeamId)
				: null,
			games,
			partner: partnerIdentity,
		};
		return [normalized];
	});

	const uniqueMatches = dedupeLinesByMatch(normalizedLines).sort((a, b) => {
		const aTime = a.matchDate?.getTime() ?? 0;
		const bTime = b.matchDate?.getTime() ?? 0;
		return aTime - bTime;
	});

	return uniqueMatches;
}

const computeWinStreak = (lines: NormalizedPlayerLine[]) => {
	let streak = 0;
	const reversed = [...lines].sort((a, b) => {
		const aTime = a.matchDate?.getTime() ?? 0;
		const bTime = b.matchDate?.getTime() ?? 0;
		return bTime - aTime;
	});

	for (const line of reversed) {
		if (line.lineWin === null) break;
		if (line.lineWin) {
			streak += 1;
		} else {
			break;
		}
	}

	return streak;
};

const buildPartnerStats = (
	lines: NormalizedPlayerLine[]
): PartnerStats | null => {
	const map = new Map<
		string,
		{ name: string; matches: number; wins: number; losses: number }
	>();

	lines.forEach((line) => {
		if (!line.partner) return;
		const entry = map.get(line.partner.id) ?? {
			name: line.partner.fullName,
			matches: 0,
			wins: 0,
			losses: 0,
		};

		entry.matches += 1;
		if (line.lineWin) {
			entry.wins += 1;
		} else if (line.lineWin === false) {
			entry.losses += 1;
		}
		map.set(line.partner.id, entry);
	});

	let best: PartnerStats | null = null;

	for (const [, value] of map) {
		const winPct =
			value.matches > 0
				? Math.round((value.wins / value.matches) * 100)
				: 0;
		const candidate: PartnerStats = {
			name: value.name,
			matches: value.matches,
			wins: value.wins,
			losses: value.losses,
			winPct,
		};

		if (!best) {
			best = candidate;
			continue;
		}

		if (
			candidate.matches > best.matches ||
			(candidate.matches === best.matches &&
				candidate.winPct > best.winPct)
		) {
			best = candidate;
		}
	}

	return best;
};

export async function fetchPlayerComputedStats(
	playerId: string
): Promise<PlayerComputedStats> {
	const [basics, lines] = await Promise.all([
		fetchPlayerBasics(playerId),
		fetchPlayerLines(playerId),
	]);

	if (!lines.length) {
		return {
			basics,
			winPercentage: 0,
			winStreak: 0,
			totalMatches: 0,
			gamesWon: 0,
			gamesLost: 0,
			linesWon: 0,
			linesLost: 0,
			linesPerMatch: 0,
			avgPointDifferential: 0,
			trend: [],
			partner: null,
		};
	}

	let gamesWon = 0;
	let gamesLost = 0;
	let linesWon = 0;
	let linesLost = 0;
	let pointDifferential = 0;

	lines.forEach((line) => {
		const { games, lineWin } = line;
		if (lineWin === true) linesWon += 1;
		else if (lineWin === false) linesLost += 1;

		games.forEach((game) => {
			const margin = game.forScore - game.againstScore;
			pointDifferential += margin;
			if (margin > 0) gamesWon += 1;
			if (margin < 0) gamesLost += 1;
		});
	});

	const totalMatches = lines.length;
	const winPercentage =
		totalMatches > 0 ? Math.round((linesWon / totalMatches) * 100) : 0;
	const linesPerMatch =
		totalMatches > 0 ? Number((linesWon / totalMatches).toFixed(2)) : 0;
	const avgPointDifferential =
		totalMatches > 0
			? Number((pointDifferential / totalMatches).toFixed(2))
			: 0;

	const trend = lines.slice(-8).map((line) => {
		const diff = line.games.reduce(
			(total, game) => total + (game.forScore - game.againstScore),
			0
		);
		return { label: line.matchLabel, value: diff };
	});

	const partner = buildPartnerStats(lines);

	return {
		basics,
		winPercentage,
		winStreak: computeWinStreak(lines),
		totalMatches,
		gamesWon,
		gamesLost,
		linesWon,
		linesLost,
		linesPerMatch,
		avgPointDifferential,
		trend,
		partner,
	};
}
