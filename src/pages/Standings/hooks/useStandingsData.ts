import { useEffect, useState } from "react";
import { getStandings } from "../../../data";
import {
	coerceIdentifierFromRecord,
	coerceNumber,
	coerceString,
} from "../../../utils/dataTransforms";

type RawStandingRecord = Record<string, unknown>;

export type StandingRecord = {
	team_id: string | number | null;
	team_name: string;
	matches_won: number | null;
	matches_lost: number | null;
	win_percentage: number | null;
	total_points: number | null;
};

type UseStandingsDataResult = {
	standings: StandingRecord[];
	isLoading: boolean;
	error: string | null;
};

export function useStandingsData(): UseStandingsDataResult {
	const [standings, setStandings] = useState<StandingRecord[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let isMounted = true;

		async function loadStandings() {
			setIsLoading(true);
			setError(null);

			try {
				const data = await getStandings();
				if (!isMounted) return;

				const sanitizedStandings: StandingRecord[] = Array.isArray(data)
					? (data as RawStandingRecord[]).map((row) => ({
							team_id: coerceIdentifierFromRecord(
								row,
								"team_id",
								"id"
							),
							team_name:
								coerceString(row["team_name"]) ??
								coerceString(row["name"]) ??
								"Unknown Team",
							matches_won: coerceNumber(row["matches_won"]),
							matches_lost: coerceNumber(row["matches_lost"]),
							win_percentage: coerceNumber(row["win_percentage"]),
							total_points: coerceNumber(row["total_points"]),
					  }))
					: [];

				const sortedStandings = sanitizedStandings.sort(
					(a, b) =>
						(b.total_points ?? Number.NEGATIVE_INFINITY) -
						(a.total_points ?? Number.NEGATIVE_INFINITY)
				);

				setStandings(sortedStandings);
			} catch (err) {
				console.error(err);
				if (isMounted) {
					setError(
						"Unable to load standings. Please confirm credentials and try again."
					);
					setStandings([]);
				}
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		}

		loadStandings();

		return () => {
			isMounted = false;
		};
	}, []);

	return { standings, isLoading, error };
}
