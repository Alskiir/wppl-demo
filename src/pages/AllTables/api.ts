import { supabase } from "../../lib/supabaseClient";
import { resolveSupabase } from "../../lib/supabaseQuery";

type OrderByClause = {
	column: string;
	ascending?: boolean;
};

type TableDescriptorEntry<Name extends string = string> = {
	name: Name;
	label: string;
	description?: string;
	limit?: number;
	orderBy?: readonly OrderByClause[];
	columns?: readonly string[];
};

const DEFAULT_LIMIT = 200;

const TABLE_DESCRIPTORS = [
	{
		name: "team",
		label: "Teams",
		description: "Core team records with locations.",
		limit: DEFAULT_LIMIT,
		orderBy: [{ column: "name" }],
		columns: ["id", "name", "location"],
	},
	{
		name: "person",
		label: "People",
		description: "Players and staff registered in the league.",
		limit: DEFAULT_LIMIT,
		orderBy: [{ column: "last_name" }, { column: "first_name" }],
		columns: [
			"id",
			"first_name",
			"last_name",
			"email",
			"phone_mobile",
			"birthday",
		],
	},
	{
		name: "team_membership",
		label: "Team Memberships",
		description: "Mapping between people and their teams.",
		limit: DEFAULT_LIMIT,
		orderBy: [{ column: "team_id" }, { column: "person_id" }],
		columns: ["id", "team_id", "person_id", "role"],
	},
	{
		name: "match",
		label: "Matches",
		description: "Scheduled matches between teams.",
		limit: DEFAULT_LIMIT,
		orderBy: [{ column: "match_date" }, { column: "match_time" }],
		columns: [
			"id",
			"match_date",
			"match_time",
			"home_team_id",
			"away_team_id",
			"winner_team_id",
			"location",
		],
	},
	{
		name: "match_line",
		label: "Match Lines",
		description: "Line matchups recorded for each match.",
		limit: DEFAULT_LIMIT,
		orderBy: [{ column: "match_id" }, { column: "line_number" }],
		columns: [
			"id",
			"match_id",
			"line_number",
			"home_player1",
			"home_player2",
			"away_player1",
			"away_player2",
			"winner_team_id",
		],
	},
	{
		name: "line_game",
		label: "Line Games",
		description: "Individual game scores per line.",
		limit: DEFAULT_LIMIT,
		orderBy: [{ column: "line_id" }, { column: "game_number" }],
		columns: ["id", "line_id", "game_number", "home_score", "away_score"],
	},
	{
		name: "team_standings",
		label: "Team Standings View",
		description: "View summarizing team records & points.",
		limit: 100,
		orderBy: [{ column: "total_points", ascending: false }],
		columns: [
			"team_id",
			"team_name",
			"matches_played",
			"matches_won",
			"matches_lost",
			"lines_won",
			"lines_lost",
			"games_won",
			"games_lost",
			"total_points",
			"win_percentage",
		],
	},
] as const satisfies ReadonlyArray<TableDescriptorEntry>;

export type DatabaseTableName = (typeof TABLE_DESCRIPTORS)[number]["name"];

export type TableDescriptor = TableDescriptorEntry<DatabaseTableName>;

export const databaseTables: TableDescriptor[] = TABLE_DESCRIPTORS.map(
	(descriptor) => ({
		...descriptor,
		orderBy: descriptor.orderBy ? [...descriptor.orderBy] : undefined,
		columns: descriptor.columns ? [...descriptor.columns] : undefined,
	})
);

export async function fetchTableRows(
	tableName: DatabaseTableName
): Promise<Record<string, unknown>[]> {
	const descriptor = databaseTables.find((entry) => entry.name === tableName);

	if (!descriptor) {
		throw new Error(`Unknown table: ${tableName}`);
	}

	const columnSelection =
		descriptor.columns && descriptor.columns.length
			? descriptor.columns.join(",")
			: "*";

	let query = supabase
		.from(tableName)
		.select(columnSelection, { head: false })
		.returns<Record<string, unknown>[]>();

	if (descriptor.orderBy) {
		for (const clause of descriptor.orderBy as readonly OrderByClause[]) {
			query = query.order(clause.column, {
				ascending: clause.ascending ?? true,
			});
		}
	}

	if (descriptor.limit) {
		query = query.limit(descriptor.limit);
	}

	return resolveSupabase<Record<string, unknown>[]>(query, {
		fallbackValue: [],
		errorMessage: `Fetching data for ${descriptor.label} failed.`,
	});
}
