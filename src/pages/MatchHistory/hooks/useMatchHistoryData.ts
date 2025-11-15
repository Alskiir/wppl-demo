import { useEffect, useMemo, useState } from "react";
import { getMatchHistoryForTeam, getTeams } from "../../../data";
import type {
	RawMatchHistoryRow,
	RawMatchLineRow,
	RawLineGameRow,
} from "../../../data/matchHistory";
import type {
	MatchHistoryEntry,
	MatchLineDetail,
	MatchResult,
	TeamOption,
} from "../types";
import type { TeamRecord } from "../../../types/league";
import { takeFirstRelationValue } from "../../../utils/dataTransforms";

type NormalizedMatchLineRow = Omit<RawMatchLineRow, "line_game"> & {
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

const normalizeLineRows = (
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

const countLinesWon = (lines: NormalizedMatchLineRow[], teamId: string) =>
	lines.reduce((total, line) => {
		if (!line?.winner_team_id) {
			return total;
		}

		return String(line.winner_team_id) === teamId ? total + 1 : total;
	}, 0);

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

const countGamesWon = (
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

const buildLineDetails = (
	lineRows: NormalizedMatchLineRow[],
	teamId: string,
	opponentId: string
): MatchLineDetail[] =>
	lineRows.map((line, index) => {
		const normalizedWinnerId = line.winner_team_id
			? String(line.winner_team_id)
			: null;

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
			games: line.line_game.map((game, gameIndex) => ({
				id: game.id ?? `${line.id}-${gameIndex}`,
				homeScore: parseScore(game.home_score),
				awayScore: parseScore(game.away_score),
			})),
		};
	});

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

const normalizeMatchHistoryRows = (
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

type UseMatchHistoryDataResult = {
	selectedTeamId: string | null;
	setSelectedTeamId: (nextValue: string | null) => void;
	teamOptions: TeamOption[];
	matches: MatchHistoryEntry[];
	selectedTeam: TeamRecord | null;
	isLoadingTeams: boolean;
	isLoadingMatches: boolean;
	isLoading: boolean;
	error: string | null;
};

export function useMatchHistoryData(
	defaultTeamId?: string
): UseMatchHistoryDataResult {
	const [teams, setTeams] = useState<TeamRecord[]>([]);
	const [selectedTeamId, setSelectedTeamId] = useState<string | null>(
		defaultTeamId ?? null
	);
	const [matches, setMatches] = useState<MatchHistoryEntry[]>([]);
	const [isLoadingTeams, setIsLoadingTeams] = useState(true);
	const [isLoadingMatches, setIsLoadingMatches] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let isMounted = true;

		async function loadTeams() {
			setIsLoadingTeams(true);
			setError(null);

			try {
				const data = await getTeams();
				if (!isMounted) return;

				const sanitizedTeams = (data ?? []).filter((team) =>
					Boolean(team?.id && team?.name)
				);

				setTeams(sanitizedTeams);

				if (sanitizedTeams.length) {
					const fallbackTeamId =
						defaultTeamId ?? String(sanitizedTeams[0].id);

					setSelectedTeamId((prev) => prev ?? fallbackTeamId);
				}
			} catch (err) {
				console.error(err);
				if (isMounted) {
					setError(
						err instanceof Error
							? err.message
							: "Unable to load teams. Please try again."
					);
				}
			} finally {
				if (isMounted) {
					setIsLoadingTeams(false);
				}
			}
		}

		loadTeams();

		return () => {
			isMounted = false;
		};
	}, [defaultTeamId]);

	useEffect(() => {
		if (!selectedTeamId) {
			setMatches([]);
			return;
		}

		let isMounted = true;

		async function loadMatchHistory(teamId: string) {
			setIsLoadingMatches(true);
			setError(null);

			try {
				const rows = await getMatchHistoryForTeam(teamId);
				if (!isMounted) return;

				setMatches(normalizeMatchHistoryRows(rows ?? [], teamId));
			} catch (err) {
				console.error(err);
				if (isMounted) {
					setError(
						err instanceof Error
							? err.message
							: "Unable to load match history. Please try again."
					);
					setMatches([]);
				}
			} finally {
				if (isMounted) {
					setIsLoadingMatches(false);
				}
			}
		}

		loadMatchHistory(selectedTeamId);

		return () => {
			isMounted = false;
		};
	}, [selectedTeamId]);

	const teamOptions = useMemo<TeamOption[]>(
		() =>
			teams.map((team) => ({
				value: String(team.id),
				label: team.name,
			})),
		[teams]
	);

	const selectedTeam = useMemo(
		() =>
			selectedTeamId
				? teams.find((team) => String(team.id) === selectedTeamId) ??
				  null
				: null,
		[teams, selectedTeamId]
	);

	return {
		selectedTeamId,
		setSelectedTeamId,
		teamOptions,
		matches,
		selectedTeam,
		isLoadingTeams,
		isLoadingMatches,
		isLoading: isLoadingTeams || isLoadingMatches,
		error,
	};
}
