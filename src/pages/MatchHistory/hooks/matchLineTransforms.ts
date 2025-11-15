import type {
	RawMatchHistoryRow,
	RawMatchLineRow,
	RawLineGameRow,
} from "../../../data/matchHistory";
import {
	formatFullName,
	takeFirstRelationValue,
} from "../../../utils/dataTransforms";
import type { MatchLineDetail, MatchLinePlayer, MatchResult } from "../types";

export type NormalizedMatchLineRow = Omit<RawMatchLineRow, "line_game"> & {
	line_game: RawLineGameRow[];
};

const normalizeLineGameRows = (
	relation: RawMatchLineRow["line_game"]
): RawLineGameRow[] => {
	if (Array.isArray(relation)) {
		return relation.filter((game): game is RawLineGameRow =>
			Boolean(game?.id)
		);
	}

	return relation && relation.id ? [relation] : [];
};

export const normalizeLineRows = (
	relation: RawMatchHistoryRow["match_line"]
): NormalizedMatchLineRow[] => {
	if (Array.isArray(relation)) {
		return relation
			.filter((line): line is RawMatchLineRow => Boolean(line?.id))
			.map((line) => ({
				...line,
				line_game: normalizeLineGameRows(line.line_game),
			}));
	}

	return relation && relation.id
		? [
				{
					...relation,
					line_game: normalizeLineGameRows(relation.line_game),
				},
		  ]
		: [];
};

const parseScore = (value: unknown): number | null => {
	if (typeof value === "number" && Number.isFinite(value)) {
		return value;
	}

	if (typeof value === "string") {
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : null;
	}

	return null;
};

export const countLinesWon = (
	lines: NormalizedMatchLineRow[],
	teamId: string
) =>
	lines.reduce((total, line) => {
		if (!line?.winner_team_id) {
			return total;
		}

		return String(line.winner_team_id) === teamId ? total + 1 : total;
	}, 0);

export const countGamesWon = (
	lines: NormalizedMatchLineRow[],
	teamId: string,
	homeTeamId: string,
	awayTeamId: string
) => {
	const normalizedHomeId = String(homeTeamId);
	const normalizedAwayId = String(awayTeamId);
	const isHomeTeam = teamId === normalizedHomeId;
	const isAwayTeam = teamId === normalizedAwayId;

	if (!isHomeTeam && !isAwayTeam) {
		return 0;
	}

	return lines.reduce((total, line) => {
		if (!line.line_game.length) {
			return total;
		}

		const lineWins = line.line_game.reduce((lineTotal, game) => {
			const homeScore = parseScore(game.home_score);
			const awayScore = parseScore(game.away_score);

			if (homeScore === null || awayScore === null) {
				return lineTotal;
			}

			if (homeScore === awayScore) {
				return lineTotal;
			}

			const didTeamWinGame = isHomeTeam
				? homeScore > awayScore
				: awayScore > homeScore;

			return didTeamWinGame ? lineTotal + 1 : lineTotal;
		}, 0);

		return total + lineWins;
	}, 0);
};

type LinePlayerRelation = RawMatchLineRow["home_player1"];

const normalizeLinePlayer = (
	relation: LinePlayerRelation
): MatchLinePlayer | null => {
	const player = takeFirstRelationValue(relation);

	if (!player || !player.id) {
		return null;
	}

	return {
		id: String(player.id),
		fullName: formatFullName(player.first_name, player.last_name),
	};
};

const buildPlayerPair = (
	first: LinePlayerRelation,
	second: LinePlayerRelation
): MatchLinePlayer[] =>
	[normalizeLinePlayer(first), normalizeLinePlayer(second)].filter(
		(player): player is MatchLinePlayer => Boolean(player)
	);

const determineLineResultForTeam = (
	winnerTeamId: string | null,
	teamId: string,
	opponentId: string
): MatchResult => {
	if (!winnerTeamId) {
		return "tie";
	}

	if (winnerTeamId === teamId) {
		return "win";
	}

	if (winnerTeamId === opponentId) {
		return "loss";
	}

	return "tie";
};

export const buildLineDetails = (
	lineRows: NormalizedMatchLineRow[],
	teamId: string,
	opponentId: string
): MatchLineDetail[] =>
	lineRows.map((line, index) => {
		const normalizedWinnerId = line.winner_team_id
			? String(line.winner_team_id)
			: null;
		const homePlayers = buildPlayerPair(
			line.home_player1,
			line.home_player2
		);
		const awayPlayers = buildPlayerPair(
			line.away_player1,
			line.away_player2
		);

		const lineNumber =
			typeof line.line_number === "number" &&
			Number.isFinite(line.line_number)
				? line.line_number
				: index + 1;

		return {
			id: line.id,
			lineNumber,
			winnerTeamId: normalizedWinnerId,
			result: determineLineResultForTeam(
				normalizedWinnerId,
				teamId,
				opponentId
			),
			homePlayers,
			awayPlayers,
			games: line.line_game.map((game, gameIndex) => ({
				id: game.id ?? `${line.id}-${gameIndex}`,
				homeScore: parseScore(game.home_score),
				awayScore: parseScore(game.away_score),
			})),
		};
	});
