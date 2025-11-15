import { useCallback, useState } from "react";
import type { Dispatch, MutableRefObject, SetStateAction } from "react";

import { fetchTeams } from "../api";
import { MIN_GAMES_PER_LINE } from "../constants";
import { determineWinner, renumberLines, todayIso } from "../lineUtils";
import type {
	LineFormState,
	PlayerOption,
	ToastState,
	TeamOption,
} from "../types";

type UseAutofillMatchOptions = {
	lines: LineFormState[];
	setLines: Dispatch<SetStateAction<LineFormState[]>>;
	teams: TeamOption[];
	setTeams: Dispatch<SetStateAction<TeamOption[]>>;
	setTeamsLoading: Dispatch<SetStateAction<boolean>>;
	setHomeTeamId: (value: string) => void;
	setAwayTeamId: (value: string) => void;
	setHomePlayers: Dispatch<SetStateAction<PlayerOption[]>>;
	setAwayPlayers: Dispatch<SetStateAction<PlayerOption[]>>;
	setMatchDate: (value: string) => void;
	setMatchTime: (value: string) => void;
	setLocation: (value: string) => void;
	setToast: Dispatch<SetStateAction<ToastState>>;
	setValidationErrors: Dispatch<SetStateAction<string[]>>;
	getRosterForTeam: (teamId: string) => Promise<PlayerOption[]>;
	rosterCacheRef: MutableRefObject<Map<string, PlayerOption[]>>;
};

const pickPlayersForLine = (
	roster: PlayerOption[],
	offset: number
): [string, string] => {
	if (!roster.length) {
		return ["", ""];
	}
	if (roster.length === 1) {
		return [roster[0].id, roster[0].id];
	}
	const first = roster[offset % roster.length];
	const second = roster[(offset + 1) % roster.length];
	return [first.id, second.id];
};

const generateGameScores = (gamesCount: number, winner: "home" | "away") => {
	const count = Math.max(gamesCount, MIN_GAMES_PER_LINE);
	const winsNeeded = Math.floor(count / 2) + 1;
	let winnerWins = 0;

	return Array.from({ length: count }, (_, idx) => {
		const winnerTakesGame = winnerWins < winsNeeded;
		if (winnerTakesGame) {
			winnerWins += 1;
		}
		const winningScore = 6;
		const losingScore = Math.max(0, winningScore - (2 + ((idx + 1) % 3)));

		if (winner === "home") {
			return winnerTakesGame
				? { home: String(winningScore), away: String(losingScore) }
				: { home: String(losingScore), away: String(winningScore) };
		}

		return winnerTakesGame
			? { home: String(losingScore), away: String(winningScore) }
			: { home: String(winningScore), away: String(losingScore) };
	});
};

export const useAutofillMatch = ({
	lines,
	setLines,
	teams,
	setTeams,
	setTeamsLoading,
	setHomeTeamId,
	setAwayTeamId,
	setHomePlayers,
	setAwayPlayers,
	setMatchDate,
	setMatchTime,
	setLocation,
	setToast,
	setValidationErrors,
	getRosterForTeam,
	rosterCacheRef,
}: UseAutofillMatchOptions) => {
	const [isAutofilling, setIsAutofilling] = useState(false);

	const autofillMatch = useCallback(async () => {
		setValidationErrors([]);
		setToast(null);
		setIsAutofilling(true);

		try {
			let availableTeams = teams;
			if (!availableTeams.length) {
				try {
					setTeamsLoading(true);
					availableTeams = await fetchTeams();
					setTeams(availableTeams);
				} finally {
					setTeamsLoading(false);
				}
			}

			if (!availableTeams.length) {
				throw new Error("No teams available to autofill.");
			}

			const shuffledTeams = [...availableTeams].sort(
				() => Math.random() - 0.5
			);

			const eligible: Array<{
				team: TeamOption;
				roster: PlayerOption[];
			}> = [];

			for (const team of shuffledTeams) {
				try {
					const roster = await getRosterForTeam(team.id);
					if (roster.length >= 2) {
						eligible.push({ team, roster });
					}
				} catch (error) {
					console.error(error);
				}

				if (eligible.length === 2) {
					break;
				}
			}

			if (eligible.length < 2) {
				throw new Error(
					"Autofill requires at least two teams with available players."
				);
			}

			const [awayEntry, homeEntry] = eligible;

			const nextLines = lines.map((line, idx) => {
				const [awayPlayer1Id, awayPlayer2Id] = pickPlayersForLine(
					awayEntry.roster,
					idx * 2
				);
				const [homePlayer1Id, homePlayer2Id] = pickPlayersForLine(
					homeEntry.roster,
					idx * 2
				);
				const winnerSide: "home" | "away" =
					idx % 2 === 0 ? "home" : "away";
				const games = generateGameScores(line.games.length, winnerSide);
				const nextLine = {
					...line,
					teamA: {
						player1Id: awayPlayer1Id,
						player2Id: awayPlayer2Id,
					},
					teamH: {
						player1Id: homePlayer1Id,
						player2Id: homePlayer2Id,
					},
					games,
				};
				const computedWinner =
					determineWinner(
						nextLine,
						homeEntry.team.id,
						awayEntry.team.id
					) ??
					(winnerSide === "home"
						? homeEntry.team.id
						: awayEntry.team.id);
				return {
					...nextLine,
					winnerTeamId: computedWinner,
				};
			});

			const fallbackLocation =
				homeEntry.team.location?.trim() ||
				`${homeEntry.team.name} Courts`;

			setHomeTeamId(homeEntry.team.id);
			setAwayTeamId(awayEntry.team.id);
			setHomePlayers(homeEntry.roster);
			setAwayPlayers(awayEntry.roster);
			rosterCacheRef.current.set(homeEntry.team.id, homeEntry.roster);
			rosterCacheRef.current.set(awayEntry.team.id, awayEntry.roster);
			setMatchDate(todayIso());
			setMatchTime("19:00");
			setLocation(fallbackLocation);
			setLines(renumberLines(nextLines));

			setToast({
				type: "success",
				message: `Autofilled ${awayEntry.team.name} at ${homeEntry.team.name}.`,
			});
		} catch (error) {
			console.error(error);
			setToast({
				type: "error",
				message:
					error instanceof Error
						? error.message
						: "Unable to autofill from the database.",
			});
		} finally {
			setIsAutofilling(false);
		}
	}, [
		getRosterForTeam,
		lines,
		rosterCacheRef,
		setAwayPlayers,
		setAwayTeamId,
		setHomePlayers,
		setHomeTeamId,
		setLines,
		setLocation,
		setMatchDate,
		setMatchTime,
		setTeams,
		setTeamsLoading,
		setToast,
		setValidationErrors,
		teams,
	]);

	return { autofillMatch, isAutofilling };
};
