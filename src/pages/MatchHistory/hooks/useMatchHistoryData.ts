import { useEffect, useMemo, useState } from "react";
import { getMatchHistoryForTeam, getTeams } from "../../../data";
import type { MatchHistoryEntry, TeamOption } from "../types";
import type { TeamRecord } from "../../../types/league";
import { normalizeMatchHistoryRows } from "./matchHistoryNormalizer";

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
