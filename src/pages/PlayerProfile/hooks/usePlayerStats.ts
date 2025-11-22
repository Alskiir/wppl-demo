import { useEffect, useState } from "react";
import { fetchPlayerComputedStats, type PlayerComputedStats } from "../api";
import { isValidUuid } from "../utils";

export const usePlayerStats = (playerId: string) => {
	const [stats, setStats] = useState<PlayerComputedStats | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;

		if (!playerId) {
			setStats(null);
			setError("Add ?playerId=<person id> to load real player data.");
			setLoading(false);
			return;
		}

		if (!isValidUuid(playerId)) {
			setStats(null);
			setError("Player id must be a valid UUID.");
			setLoading(false);
			return;
		}

		setLoading(true);
		setStats(null);
		setError(null);

		fetchPlayerComputedStats(playerId)
			.then((result) => {
				if (!cancelled) {
					setStats(result);
				}
			})
			.catch((err) => {
				if (!cancelled) {
					setError(
						err instanceof Error
							? err.message
							: "Unable to load player data."
					);
					setStats(null);
				}
			})
			.finally(() => {
				if (!cancelled) {
					setLoading(false);
				}
			});

		return () => {
			cancelled = true;
		};
	}, [playerId]);

	return { stats, error, loading };
};
