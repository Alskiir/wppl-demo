import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";

import { fetchPlayersForTeam, fetchTeams, saveMatch } from "../api";
import { determineWinner, deriveMatchWinner, todayIso } from "../lineUtils";
import type { PlayerOption, ToastState, TeamOption } from "../types";
import { useAutofillMatch } from "./useAutofillMatch";
import { useLinesState } from "./useLinesState";
import { validateMatchEntryForm } from "./validateMatchEntryForm";

export const useMatchEntryForm = () => {
	const rosterCacheRef = useRef<Map<string, PlayerOption[]>>(new Map());
	const [teams, setTeams] = useState<TeamOption[]>([]);
	const [teamsLoading, setTeamsLoading] = useState(false);
	const [homeTeamId, setHomeTeamId] = useState("");
	const [awayTeamId, setAwayTeamId] = useState("");
	const [homePlayers, setHomePlayers] = useState<PlayerOption[]>([]);
	const [awayPlayers, setAwayPlayers] = useState<PlayerOption[]>([]);
	const {
		lines,
		setLines,
		maxGames,
		resetLines,
		handlePlayerChange,
		handleGameScoreChange,
		handleWinnerChange,
		addGameToLine,
		removeGameFromLine,
		addLine,
		removeLine,
	} = useLinesState(homeTeamId, awayTeamId);
	const [matchDate, setMatchDate] = useState(todayIso());
	const [matchTime, setMatchTime] = useState("");
	const [location, setLocation] = useState("");
	const [toast, setToast] = useState<ToastState>(null);
	const [validationErrors, setValidationErrors] = useState<string[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const getRosterForTeam = async (teamId: string) => {
		const cached = rosterCacheRef.current.get(teamId);
		if (cached) {
			return cached;
		}
		const roster = await fetchPlayersForTeam(teamId);
		rosterCacheRef.current.set(teamId, roster);
		return roster;
	};

	const { autofillMatch, isAutofilling } = useAutofillMatch({
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
	});

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
					message: "Unable to load teams.",
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

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setValidationErrors([]);
		setToast(null);

		const errors = validateMatchEntryForm({
			lines,
			homeTeamId,
			awayTeamId,
			matchDate,
			matchTime,
			location,
		});
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
