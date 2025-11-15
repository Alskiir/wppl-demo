import { useCallback, useMemo, useState } from "react";

import {
	DEFAULT_GAMES_PER_LINE,
	DEFAULT_LINE_COUNT,
	MIN_GAMES_PER_LINE,
} from "../constants";
import { createEmptyLine, determineWinner, renumberLines } from "../lineUtils";
import type { LineFormState } from "../types";

const createInitialLines = () =>
	Array.from({ length: DEFAULT_LINE_COUNT }, (_, idx) =>
		createEmptyLine(idx + 1)
	);

type Side = "teamA" | "teamH";
type PlayerSlot = "player1Id" | "player2Id";
type ScoreField = "home" | "away";

export const useLinesState = (homeTeamId: string, awayTeamId: string) => {
	const [lines, setLines] = useState<LineFormState[]>(createInitialLines);

	const resetLines = useCallback(() => setLines(createInitialLines()), []);

	const withComputedWinner = useCallback(
		(line: LineFormState) => ({
			...line,
			winnerTeamId: determineWinner(line, homeTeamId, awayTeamId),
		}),
		[awayTeamId, homeTeamId]
	);

	const handlePlayerChange = useCallback(
		(lineId: string, side: Side, slot: PlayerSlot, value: string) => {
			setLines((prev) =>
				prev.map((line) =>
					line.id === lineId
						? {
								...line,
								[side]: { ...line[side], [slot]: value },
						  }
						: line
				)
			);
		},
		[]
	);

	const handleGameScoreChange = useCallback(
		(
			lineId: string,
			gameIndex: number,
			field: ScoreField,
			value: string
		) => {
			setLines((prev) =>
				prev.map((line) => {
					if (line.id !== lineId) return line;
					const games = line.games.map((game, idx) =>
						idx === gameIndex ? { ...game, [field]: value } : game
					);
					return withComputedWinner({ ...line, games });
				})
			);
		},
		[withComputedWinner]
	);

	const handleWinnerChange = useCallback((lineId: string, value: string) => {
		setLines((prev) =>
			prev.map((line) =>
				line.id === lineId
					? { ...line, winnerTeamId: value || null }
					: line
			)
		);
	}, []);

	const addGameToLine = useCallback(
		(lineId: string) => {
			setLines((prev) =>
				prev.map((line) => {
					if (line.id !== lineId) return line;
					const games = [...line.games, { home: "", away: "" }];
					return withComputedWinner({ ...line, games });
				})
			);
		},
		[withComputedWinner]
	);

	const removeGameFromLine = useCallback(
		(lineId: string) => {
			setLines((prev) =>
				prev.map((line) => {
					if (line.id !== lineId) return line;
					if (line.games.length <= MIN_GAMES_PER_LINE) return line;
					const games = line.games.slice(0, -1);
					return withComputedWinner({ ...line, games });
				})
			);
		},
		[withComputedWinner]
	);

	const addLine = useCallback(() => {
		setLines((prev) => [...prev, createEmptyLine(prev.length + 1)]);
	}, []);

	const removeLine = useCallback(() => {
		setLines((prev) => {
			if (prev.length === 1) return prev;
			return renumberLines(prev.slice(0, -1));
		});
	}, []);

	const maxGames = useMemo(() => {
		const maxFromLines = lines.reduce(
			(max, line) => Math.max(max, line.games.length),
			MIN_GAMES_PER_LINE
		);
		return Math.max(DEFAULT_GAMES_PER_LINE, maxFromLines);
	}, [lines]);

	return {
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
	};
};
