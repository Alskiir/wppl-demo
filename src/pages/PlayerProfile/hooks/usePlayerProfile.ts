import { useMemo } from "react";
import type { PlayerComputedStats } from "../api";
import type { PlayerProfile, Stat, TrendPoint, StatHighlight } from "../types";
import { DEFAULT_PROFILE_COPY } from "../constants";
import { formatSigned } from "../utils";

export const usePlayerProfile = (stats: PlayerComputedStats | null) => {
	const profile: PlayerProfile | null = useMemo(() => {
		if (!stats) {
			return null;
		}

		return {
			name: stats.basics.fullName,
			handle: stats.basics.handle,
			role: DEFAULT_PROFILE_COPY.role,
			team: stats.basics.teamName,
			location: stats.basics.teamLocation,
			joined: stats.basics.joinedLabel,
			bio: stats.basics.bio,
			coverImage:
				stats.basics.coverUrl ?? DEFAULT_PROFILE_COPY.coverImage,
			avatarImage:
				stats.basics.avatarUrl ?? DEFAULT_PROFILE_COPY.avatarImage,
		};
	}, [stats]);

	const quickStats: Stat[] = useMemo(() => {
		if (!stats) return [];
		return [
			{ label: "Win percentage", value: `${stats.winPercentage}%` },
			{
				label: "Current win streak",
				value: `${stats.winStreak} match${
					stats.winStreak === 1 ? "" : "es"
				}`,
			},
			{
				label: "Highest win streak",
				value: `${stats.highestWinStreak} match${
					stats.highestWinStreak === 1 ? "" : "es"
				}`,
			},
			{ label: "Total matches", value: `${stats.totalMatches} played` },
		];
	}, [stats]);

	const socialStats: Stat[] = useMemo(() => {
		if (!stats) return [];
		return [
			{ label: "Games won", value: `${stats.gamesWon}` },
			{ label: "Games lost", value: `${stats.gamesLost}` },
			{
				label: "Lines won / match",
				value: `${stats.linesPerMatch.toFixed(2)} avg`,
			},
		];
	}, [stats]);

	const trend: TrendPoint[] = useMemo(() => stats?.trend ?? [], [stats]);

	const statHighlights: StatHighlight[] = useMemo(() => {
		if (!stats) return [];
		return [
			{
				label: "Average point differential",
				value: `${formatSigned(stats.avgPointDifferential, " pts")}`,
				change: stats.trend.length
					? `Across the last ${stats.trend.length} matches`
					: "Across recorded matches",
				trend: stats.avgPointDifferential >= 0 ? "up" : "down",
			},
			{
				label: "Games won vs lost",
				value: `${stats.gamesWon} / ${stats.gamesLost}`,
				change: `${stats.gamesWon + stats.gamesLost} total games`,
				trend: stats.winStreak > 0 ? "up" : "down",
			},
			{
				label: "Lines won per match",
				value: `${stats.linesPerMatch.toFixed(2)} avg`,
				change: formatSigned(
					stats.linesPerMatch - 1,
					" vs league average"
				),
				trend: stats.linesPerMatch >= 1 ? "up" : "down",
			},
		];
	}, [stats]);

	const partner = stats?.partner ?? null;

	return {
		profile,
		quickStats,
		socialStats,
		trend,
		statHighlights,
		partner,
	};
};
