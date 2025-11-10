import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";

import { fetchPlayersForTeam, fetchTeams, saveMatch } from "../api";
import { DEFAULT_LINE_COUNT, MIN_GAMES_PER_LINE } from "../constants";
import {
	createEmptyLine,
	determineWinner,
	deriveMatchWinner,
	renumberLines,
	todayIso,
} from "../lineUtils";
import type {
	GameScore,
	LineFormState,
	PlayerOption,
	ToastState,
	TeamOption,
} from "../types";

const initialLines = () =>
	Array.from({ length: DEFAULT_LINE_COUNT }, (_, idx) =>
		createEmptyLine(idx + 1)
	);

export const useMatchEntryForm = () => {
	const rosterCacheRef = useRef<Map<string, PlayerOption[]>>(new Map());
	const [teams, setTeams] = useState<TeamOption[]>([]);
	const [teamsLoading, setTeamsLoading] = useState(false);
	const [homeTeamId, setHomeTeamId] = useState("");
	const [awayTeamId, setAwayTeamId] = useState("");
	const [homePlayers, setHomePlayers] = useState<PlayerOption[]>([]);
	const [awayPlayers, setAwayPlayers] = useState<PlayerOption[]>([]);
	const [lines, setLines] = useState<LineFormState[]>(initialLines);
	const [matchDate, setMatchDate] = useState(todayIso());
	const [matchTime, setMatchTime] = useState("");
	const [location, setLocation] = useState("");
	const [toast, setToast] = useState<ToastState>(null);
	const [validationErrors, setValidationErrors] = useState<string[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isAutofilling, setIsAutofilling] = useState(false);

	const getRosterForTeam = async (teamId: string) => {
		const cached = rosterCacheRef.current.get(teamId);
		if (cached) {
			return cached;
		}
		const roster = await fetchPlayersForTeam(teamId);
		rosterCacheRef.current.set(teamId, roster);
		return roster;
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

	const generateGameScores = (
		gamesCount: number,
		winner: "home" | "away"
	): GameScore[] => {
		const count = Math.max(gamesCount, MIN_GAMES_PER_LINE);
		const winsNeeded = Math.floor(count / 2) + 1;
		let winnerWins = 0;

		return Array.from({ length: count }, (_, idx) => {
			const winnerTakesGame = winnerWins < winsNeeded;
			if (winnerTakesGame) {
				winnerWins += 1;
			}
			const winningScore = 6;
			const losingScore = Math.max(
				0,
				winningScore - (2 + ((idx + 1) % 3))
			);

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

	const maxGames = useMemo(
		() =>
			lines.reduce(
				(max, line) => Math.max(max, line.games.length),
				MIN_GAMES_PER_LINE
			),
		[lines]
	);

	const homeTeam = useMemo(
		() => teams.find((team) => team.id === homeTeamId),
		[homeTeamId, teams]
	);
	const awayTeam = useMemo(
		() => teams.find((team) => team.id === awayTeamId),
		[awayTeamId, teams]
	);

	const matchTitle = useMemo(() => {
		if (homeTeam && awayTeam) {
			return `${awayTeam.name} (A) vs ${homeTeam.name} (H)`;
		}
		if (homeTeam) return `${homeTeam.name} (H)`;
		if (awayTeam) return `${awayTeam.name} (A)`;
		return "Match Entry";
	}, [awayTeam, homeTeam]);

	useEffect(() => {
		let isMounted = true;
		const loadTeams = async () => {
			try {
				setTeamsLoading(true);
				const data = await fetchTeams();
				if (!isMounted) return;
				setTeams(data);
			} catch (error) {
				if (!isMounted) return;
				console.error(error);
				setToast({
					type: "error",
					message: "Unable to load teams from Supabase.",
				});
			} finally {
				if (isMounted) {
					setTeamsLoading(false);
				}
			}
		};

		loadTeams();

		return () => {
			isMounted = false;
		};
	}, []);

	useEffect(() => {
		let isActive = true;
		const loadPlayers = async (
			teamId: string,
			setPlayers: typeof setHomePlayers
		) => {
			if (!teamId) {
				setPlayers([]);
				return;
			}

			try {
				const roster = await getRosterForTeam(teamId);
				if (!isActive) return;
				if (!isActive) return;
				setPlayers(roster);
			} catch (error) {
				if (!isActive) return;
				console.error(error);
				setToast({
					type: "error",
					message: "Unable to load players for the selected team.",
				});
				setPlayers([]);
			}
		};

		loadPlayers(homeTeamId, setHomePlayers);
		loadPlayers(awayTeamId, setAwayPlayers);

		return () => {
			isActive = false;
		};
	}, [homeTeamId, awayTeamId]);

	const resetLines = () => setLines(initialLines());

	const handleHomeTeamChange = (value: string) => {
		setHomeTeamId(value);
		setLines((prev) =>
			prev.map((line) => {
				const next = {
					...line,
					teamH: { player1Id: "", player2Id: "" },
				};
				return {
					...next,
					winnerTeamId: determineWinner(next, value, awayTeamId),
				};
			})
		);
	};

	const handleAwayTeamChange = (value: string) => {
		setAwayTeamId(value);
		setLines((prev) =>
			prev.map((line) => {
				const next = {
					...line,
					teamA: { player1Id: "", player2Id: "" },
				};
				return {
					...next,
					winnerTeamId: determineWinner(next, homeTeamId, value),
				};
			})
		);
	};

	const handlePlayerChange = (
		lineId: string,
		side: "teamA" | "teamH",
		slot: "player1Id" | "player2Id",
		value: string
	) => {
		setLines((prev) =>
			prev.map((line) => {
				if (line.id !== lineId) return line;
				if (side === "teamA") {
					return {
						...line,
						teamA: { ...line.teamA, [slot]: value },
					};
				}
				return {
					...line,
					teamH: { ...line.teamH, [slot]: value },
				};
			})
		);
	};

	const handleGameScoreChange = (
		lineId: string,
		gameIndex: number,
		field: "home" | "away",
		value: string
	) => {
		setLines((prev) =>
			prev.map((line) => {
				if (line.id !== lineId) return line;

				const games = line.games.map((game, idx) =>
					idx === gameIndex ? { ...game, [field]: value } : game
				);

				const nextLine = { ...line, games };
				return {
					...nextLine,
					winnerTeamId: determineWinner(
						nextLine,
						homeTeamId,
						awayTeamId
					),
				};
			})
		);
	};

	const handleWinnerChange = (lineId: string, value: string) => {
		setLines((prev) =>
			prev.map((line) =>
				line.id === lineId
					? { ...line, winnerTeamId: value || null }
					: line
			)
		);
	};

	const addGameToLine = (lineId: string) => {
		setLines((prev) =>
			prev.map((line) => {
				if (line.id !== lineId) return line;
				const games = [
					...line.games,
					{
						home: "",
						away: "",
					},
				];
				const nextLine = { ...line, games };
				return {
					...nextLine,
					winnerTeamId: determineWinner(
						nextLine,
						homeTeamId,
						awayTeamId
					),
				};
			})
		);
	};

	const removeGameFromLine = (lineId: string) => {
		setLines((prev) =>
			prev.map((line) => {
				if (line.id !== lineId) return line;
				if (line.games.length <= MIN_GAMES_PER_LINE) return line;
				const games = line.games.slice(0, -1);
				const nextLine = { ...line, games };
				return {
					...nextLine,
					winnerTeamId: determineWinner(
						nextLine,
						homeTeamId,
						awayTeamId
					),
				};
			})
		);
	};

	const addLine = () => {
		setLines((prev) => [...prev, createEmptyLine(prev.length + 1)]);
	};

	const removeLine = () => {
		setLines((prev) => {
			if (prev.length === 1) return prev;
			return renumberLines(prev.slice(0, -1));
		});
	};

	const validateForm = () => {
		const errors: string[] = [];
		if (!homeTeamId) errors.push("Select a home team.");
		if (!awayTeamId) errors.push("Select an away team.");
		if (homeTeamId && awayTeamId && homeTeamId === awayTeamId) {
			errors.push("Home and away teams must be different.");
		}
		if (!matchDate) errors.push("Provide a match date.");
		if (!matchTime) errors.push("Provide a start time.");
		if (!location.trim()) errors.push("Enter the match location.");

		lines.forEach((line) => {
			if (!line.teamA.player1Id || !line.teamA.player2Id) {
				errors.push(
					`Line ${line.lineNumber}: select both away players.`
				);
			}
			if (!line.teamH.player1Id || !line.teamH.player2Id) {
				errors.push(
					`Line ${line.lineNumber}: select both home players.`
				);
			}

			line.games.forEach((game, idx) => {
				if (game.away === "" || game.home === "") {
					errors.push(
						`Line ${line.lineNumber}: enter scores for Game ${
							idx + 1
						}.`
					);
				}
			});

			if (!line.winnerTeamId) {
				errors.push(
					`Line ${line.lineNumber}: winner missing or tie detected.`
				);
			}
		});

		return errors;
	};

	const resetForm = () => {
		setHomeTeamId("");
		setAwayTeamId("");
		setHomePlayers([]);
		setAwayPlayers([]);
		setMatchDate(todayIso());
		setMatchTime("");
		setLocation("");
		resetLines();
	};

	const autofillMatch = async () => {
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
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setValidationErrors([]);
		setToast(null);

		const errors = validateForm();
		if (errors.length) {
			setValidationErrors(errors);
			setToast({
				type: "error",
				message: "Fix the highlighted issues before submitting.",
			});
			return;
		}

		try {
			setIsSubmitting(true);

			const matchWinnerTeamId = deriveMatchWinner(
				lines,
				homeTeamId,
				awayTeamId
			);

			await saveMatch({
				homeTeamId,
				awayTeamId,
				matchDate,
				matchTime,
				location,
				lines,
				matchWinnerTeamId,
			});

			setToast({
				type: "success",
				message: "Match and lines saved successfully.",
			});
			resetForm();
		} catch (error) {
			console.error(error);
			setToast({
				type: "error",
				message:
					error instanceof Error
						? error.message
						: "Submission failed.",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return {
		teams,
		teamsLoading,
		homeTeamId,
		awayTeamId,
		homePlayers,
		awayPlayers,
		lines,
		matchDate,
		matchTime,
		location,
		toast,
		validationErrors,
		isSubmitting,
		maxGames,
		homeTeam,
		awayTeam,
		matchTitle,
		autofillMatch,
		isAutofilling,
		handleHomeTeamChange,
		handleAwayTeamChange,
		handlePlayerChange,
		handleGameScoreChange,
		handleWinnerChange,
		addGameToLine,
		removeGameFromLine,
		addLine,
		removeLine,
		setMatchDate,
		setMatchTime,
		setLocation,
		handleSubmit,
	};
};
