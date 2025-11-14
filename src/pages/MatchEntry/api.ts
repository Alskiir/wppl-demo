import { supabase } from "../../lib/supabaseClient";
import { resolveSupabase } from "../../lib/supabaseQuery";
import type { PersonRecord, SupabaseRelation } from "../../types/league";
import {
	formatFullName,
	takeFirstRelationValue,
} from "../../utils/dataTransforms";
import type { LineFormState, PlayerOption, TeamOption } from "./types";

type PlayerRecord = Pick<PersonRecord, "id" | "first_name" | "last_name">;

type TeamMembershipRow = {
	person: SupabaseRelation<PlayerRecord>;
};

export const fetchTeams = async (): Promise<TeamOption[]> => {
	return resolveSupabase(
		supabase.from("team").select("id, name, location").order("name"),
		{ fallbackValue: [] }
	);
};

export const fetchPlayersForTeam = async (
	teamId: string
): Promise<PlayerOption[]> => {
	const typedRows = await resolveSupabase<TeamMembershipRow[]>(
		supabase
			.from("team_membership")
			.select(
				`
				person:person_id (
					id,
					first_name,
					last_name
				)
			`
			)
			.eq("team_id", teamId)
			.order("person_id", { ascending: true }),
		{ fallbackValue: [] }
	);

	return typedRows
		.map((row) => {
			const person = takeFirstRelationValue(row.person);

			if (!person) return null;
			return {
				id: person.id,
				fullName: formatFullName(person.first_name, person.last_name),
			};
		})
		.filter((player): player is PlayerOption => Boolean(player));
};

type SaveMatchArgs = {
	homeTeamId: string;
	awayTeamId: string;
	matchDate: string;
	matchTime: string;
	location: string;
	lines: LineFormState[];
	matchWinnerTeamId: string | null;
};

type MatchInsertPayload = {
	home_team_id: string;
	away_team_id: string;
	match_date: string;
	match_time: string;
	location: string;
	winner_team_id: string | null;
};

type MatchRow = MatchInsertPayload & { id: string };

type LineInsertRow = {
	match_id: string;
	line_number: number;
	away_player1: string;
	away_player2: string;
	home_player1: string;
	home_player2: string;
	winner_team_id: string | null;
};

type InsertedLineRow = {
	id: string;
	line_number: number;
};

type GameInsertRow = {
	line_id: string;
	game_number: number;
	home_score: number;
	away_score: number;
};

const insertMatchRecord = async (payload: MatchInsertPayload) =>
	resolveSupabase<MatchRow>(
		supabase.from("match").insert([payload]).select().single(),
		{ errorMessage: "Match insert failed." }
	);

const buildLineInsertPayload = (
	matchId: string,
	lines: LineFormState[]
): LineInsertRow[] =>
	lines.map((line, idx) => ({
		match_id: matchId,
		line_number: line.lineNumber || idx + 1,
		away_player1: line.teamA.player1Id,
		away_player2: line.teamA.player2Id,
		home_player1: line.teamH.player1Id,
		home_player2: line.teamH.player2Id,
		winner_team_id: line.winnerTeamId,
	}));

const insertLinesForMatch = async (matchId: string, lines: LineFormState[]) => {
	const lineRows = await resolveSupabase<InsertedLineRow[]>(
		supabase
			.from("match_line")
			.insert(buildLineInsertPayload(matchId, lines))
			.select("id, line_number"),
		{ errorMessage: "Unable to create line rows." }
	);

	if (!lineRows.length) {
		throw new Error("Unable to create line rows. Database returned none.");
	}

	return lineRows;
};

const createLineIdMap = (rows: InsertedLineRow[]) =>
	rows.reduce<Map<number, string>>((acc, row) => {
		acc.set(row.line_number, row.id);
		return acc;
	}, new Map());

const assertLinesInserted = (
	lines: LineFormState[],
	lineIdMap: Map<number, string>
) => {
	const missingLine = lines.find((line) => !lineIdMap.has(line.lineNumber));

	if (missingLine) {
		throw new Error(
			`Line mapping mismatch for line ${missingLine.lineNumber}. Please retry.`
		);
	}
};

const buildGameInsertRows = (
	lines: LineFormState[],
	lineIdMap: Map<number, string>
): GameInsertRow[] =>
	lines.flatMap((line) => {
		const lineId = lineIdMap.get(line.lineNumber);
		if (!lineId) {
			return [];
		}

		return line.games.map((game, gameIdx) => ({
			line_id: lineId,
			game_number: gameIdx + 1,
			home_score: Number(game.home),
			away_score: Number(game.away),
		}));
	});

const insertGamesForLines = async (rows: GameInsertRow[]) => {
	if (!rows.length) return;

	await resolveSupabase(supabase.from("line_game").insert(rows), {
		allowNull: true,
		errorMessage: "Unable to create game rows.",
	});
};

export const saveMatch = async ({
	homeTeamId,
	awayTeamId,
	matchDate,
	matchTime,
	location,
	lines,
	matchWinnerTeamId,
}: SaveMatchArgs) => {
	const matchRecord = await insertMatchRecord({
		home_team_id: homeTeamId,
		away_team_id: awayTeamId,
		match_date: matchDate,
		match_time: matchTime,
		location,
		winner_team_id: matchWinnerTeamId,
	});

	const insertedLines = await insertLinesForMatch(matchRecord.id, lines);
	const lineIdMap = createLineIdMap(insertedLines);

	assertLinesInserted(lines, lineIdMap);

	const gameRows = buildGameInsertRows(lines, lineIdMap);
	await insertGamesForLines(gameRows);

	return matchRecord;
};
