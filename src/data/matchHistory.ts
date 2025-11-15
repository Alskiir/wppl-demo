import { supabase } from "../lib/supabaseClient";
import { resolveSupabase } from "../lib/supabaseQuery";
import type {
	PersonRecord,
	SupabaseRelation,
	TeamRecord,
} from "../types/league";

export type RawLineGameRow = {
	id: string;
	home_score: number | null;
	away_score: number | null;
};

type LinePlayerRelation = SupabaseRelation<
	Pick<PersonRecord, "id" | "first_name" | "last_name">
>;

export type RawMatchLineRow = {
	id: string;
	line_number: number | null;
	winner_team_id: string | null;
	line_game: SupabaseRelation<RawLineGameRow>;
	home_player1: LinePlayerRelation;
	home_player2: LinePlayerRelation;
	away_player1: LinePlayerRelation;
	away_player2: LinePlayerRelation;
};

export type RawMatchHistoryRow = {
	id: string;
	match_date: string;
	match_time: string | null;
	location: string | null;
	home_team_id: string;
	away_team_id: string;
	winner_team_id: string | null;
	home_team: SupabaseRelation<Pick<TeamRecord, "id" | "name">>;
	away_team: SupabaseRelation<Pick<TeamRecord, "id" | "name">>;
	match_line: SupabaseRelation<RawMatchLineRow>;
};

const MATCH_HISTORY_SELECTION = `
		id,
		match_date,
		match_time,
		location,
		home_team_id,
		away_team_id,
		winner_team_id,
		home_team:home_team_id ( id, name ),
		away_team:away_team_id ( id, name ),
		match_line (
			id,
			line_number,
			winner_team_id,
			home_player1:home_player1 (
				id,
				first_name,
				last_name
			),
			home_player2:home_player2 (
				id,
				first_name,
				last_name
			),
			away_player1:away_player1 (
				id,
				first_name,
				last_name
			),
			away_player2:away_player2 (
				id,
				first_name,
				last_name
			),
			line_game (
				id,
				home_score,
				away_score
			)
		)
	`;

export async function getMatchHistoryForTeam(
	teamId: string
): Promise<RawMatchHistoryRow[]> {
	if (!teamId) {
		return [];
	}

	return resolveSupabase(
		supabase
			.from("match")
			.select(MATCH_HISTORY_SELECTION)
			.or(`home_team_id.eq.${teamId},away_team_id.eq.${teamId}`)
			.order("match_date", { ascending: false })
			.order("match_time", { ascending: false }),
		{
			fallbackValue: [],
			errorMessage: "Unable to load match history for the selected team.",
		}
	);
}
