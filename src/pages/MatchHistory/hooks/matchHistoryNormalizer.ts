import type { RawMatchHistoryRow } from "../../../data/matchHistory";
import { takeFirstRelationValue } from "../../../utils/dataTransforms";
import type { MatchHistoryEntry, MatchResult } from "../types";
import {
	buildLineDetails,
	countGamesWon,
	countLinesWon,
	normalizeLineRows,
} from "./matchLineTransforms";

const determineResult = (
	declaredWinnerId: string | null,
	teamScore: number,
	opponentScore: number,
	teamId: string,
	opponentId: string
): MatchResult => {
	if (declaredWinnerId === teamId) {
		return "win";
	}

	if (declaredWinnerId === opponentId) {
		return "loss";
	}

	if (teamScore === opponentScore) {
		return "tie";
	}

	return teamScore > opponentScore ? "win" : "loss";
};

export const normalizeMatchHistoryRows = (
	rows: RawMatchHistoryRow[],
	teamId: string
): MatchHistoryEntry[] => {
	const normalizedTeamId = String(teamId);

	return rows
		.map((row) => {
			const homeTeam = takeFirstRelationValue(row.home_team);
			const awayTeam = takeFirstRelationValue(row.away_team);

			if (!homeTeam || !awayTeam) {
				return null;
			}

			const isHomeMatch = String(row.home_team_id) === normalizedTeamId;
			const opponent = isHomeMatch ? awayTeam : homeTeam;
			const opponentId = String(opponent.id);
			const lineRows = normalizeLineRows(row.match_line);
			const lines = buildLineDetails(
				lineRows,
				normalizedTeamId,
				opponentId
			);

			const teamScore = countLinesWon(lineRows, normalizedTeamId);
			const opponentScore = countLinesWon(lineRows, opponentId);
			const gamesWon = countGamesWon(
				lineRows,
				normalizedTeamId,
				row.home_team_id,
				row.away_team_id
			);
			const gamesLost = countGamesWon(
				lineRows,
				opponentId,
				row.home_team_id,
				row.away_team_id
			);

			const declaredWinnerId = row.winner_team_id
				? String(row.winner_team_id)
				: null;

			const result = determineResult(
				declaredWinnerId,
				teamScore,
				opponentScore,
				normalizedTeamId,
				opponentId
			);

			return {
				id: row.id,
				teamId: normalizedTeamId,
				matchDate: row.match_date ?? "",
				matchTime: row.match_time ?? null,
				location: row.location ?? null,
				opponentName: opponent.name ?? "Unknown opponent",
				opponentId,
				isHomeMatch,
				teamScore,
				opponentScore,
				result,
				pointsEarned: gamesWon,
				gamesWon,
				gamesLost,
				lines,
			};
		})
		.filter((entry): entry is MatchHistoryEntry => Boolean(entry));
};
