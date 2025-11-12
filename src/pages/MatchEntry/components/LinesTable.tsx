import { useEffect, useMemo, useRef, useState } from "react";
import { Text } from "../../../components";
import {
	BASE_TABLE_WEIGHT,
	COLUMN_WIDTH_CLASS,
	FALLBACK_UNIT_WIDTH,
	GAME_COLUMN_WEIGHT,
	GAME_COLUMN_WIDTH_CLASS,
	LINE_COLUMN_WEIGHT,
	LINE_COLUMN_WIDTH_CLASS,
	PLAYER_COLUMN_WEIGHT,
	STATIC_COLUMN_WEIGHT,
	WINNER_COLUMN_WEIGHT,
} from "../constants";
import type { LineFormState, PlayerOption, TeamOption } from "../types";
import LineRow, { type LineRowColumnWidths } from "./LineRow";

type LinesTableProps = {
	lines: LineFormState[];
	maxGames: number;
	homeTeamId: string;
	awayTeamId: string;
	homeTeam?: TeamOption;
	awayTeam?: TeamOption;
	homePlayers: PlayerOption[];
	awayPlayers: PlayerOption[];
	onAddLine: () => void;
	onRemoveLine: () => void;
	onAddGameToLine: (lineId: string) => void;
	onRemoveGameFromLine: (lineId: string) => void;
	onPlayerChange: (
		lineId: string,
		side: "teamA" | "teamH",
		slot: "player1Id" | "player2Id",
		value: string
	) => void;
	onGameScoreChange: (
		lineId: string,
		gameIndex: number,
		field: "home" | "away",
		value: string
	) => void;
	onWinnerChange: (lineId: string, value: string) => void;
};

const LinesTable = ({
	lines,
	maxGames,
	homeTeamId,
	awayTeamId,
	homeTeam,
	awayTeam,
	homePlayers,
	awayPlayers,
	onAddLine,
	onRemoveLine,
	onAddGameToLine,
	onRemoveGameFromLine,
	onPlayerChange,
	onGameScoreChange,
	onWinnerChange,
}: LinesTableProps) => {
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const [containerWidth, setContainerWidth] = useState(0);

	useEffect(() => {
		const node = scrollContainerRef.current;
		if (!node) {
			return;
		}

		const updateWidth = () => {
			const nextWidth = node.getBoundingClientRect().width;
			setContainerWidth((prev) =>
				Math.abs(prev - nextWidth) > 1 ? nextWidth : prev
			);
		};

		updateWidth();

		if (typeof window === "undefined") {
			return;
		}

		if (typeof ResizeObserver === "undefined") {
			window.addEventListener("resize", updateWidth);
			return () => window.removeEventListener("resize", updateWidth);
		}

		const observer = new ResizeObserver((entries) => {
			if (!entries.length) {
				return;
			}
			const entry = entries[0];
			setContainerWidth(entry.contentRect.width);
		});

		observer.observe(node);

		return () => observer.disconnect();
	}, []);

	const unitWidth =
		containerWidth > 0
			? containerWidth / BASE_TABLE_WEIGHT
			: FALLBACK_UNIT_WIDTH;

	const columnWidths: LineRowColumnWidths = useMemo(
		() => ({
			line: LINE_COLUMN_WEIGHT * unitWidth,
			player: PLAYER_COLUMN_WEIGHT * unitWidth,
			game: GAME_COLUMN_WEIGHT * unitWidth,
			winner: WINNER_COLUMN_WEIGHT * unitWidth,
		}),
		[unitWidth]
	);

	const getColumnStyle = (value: number) => ({
		width: `${value}px`,
		minWidth: `${value}px`,
	});

	const totalWeight = STATIC_COLUMN_WEIGHT + maxGames * GAME_COLUMN_WEIGHT;
	const tableWidth = Math.max(containerWidth, totalWeight * unitWidth || 0);

	return (
		<section className="md-card overflow-hidden p-0">
			<div className="flex flex-col gap-4 border-b border-(--border-subtle) bg-(--surface-panel) px-4 py-5 md:flex-row md:items-center md:justify-between md:px-6 md:py-6">
				<div className="space-y-2">
					<Text as="p" variant="strong" size="lg">
						Lines
					</Text>
					<Text variant="muted" size="sm" className="max-w-3xl">
						Default view shows five lines.
						<br />
						Adjust the number of lines or games per line to match
						the match sheet you are entering.
					</Text>
				</div>
				<div className="flex flex-wrap gap-3">
					<button
						type="button"
						onClick={onRemoveLine}
						className="md-outlined-button text-sm"
						disabled={lines.length === 1}
					>
						Remove Line
					</button>
					<button
						type="button"
						onClick={onAddLine}
						className="md-filled-button text-sm"
					>
						Add Line
					</button>
				</div>
			</div>

			<div className="overflow-x-auto" ref={scrollContainerRef}>
				<table
					className="table-auto text-sm text-(--text-primary)"
					style={{ width: `${tableWidth || 0}px` }}
				>
					<thead className="bg-(--surface-panel)">
						<tr>
							<th
								className={`${LINE_COLUMN_WIDTH_CLASS} text-center first:text-left`}
								style={getColumnStyle(columnWidths.line)}
							>
								<Text
									as="span"
									variant="tableHeader"
									size="xs"
									align="left"
								>
									Line
								</Text>
							</th>
							<th
								className={`${COLUMN_WIDTH_CLASS} text-center first:text-left`}
								style={getColumnStyle(columnWidths.player)}
							>
								<Text
									as="span"
									variant="tableHeader"
									size="xs"
									align="center"
								>
									Team A Players
								</Text>
							</th>
							<th
								className={`${COLUMN_WIDTH_CLASS} text-center first:text-left`}
								style={getColumnStyle(columnWidths.player)}
							>
								<Text
									as="span"
									variant="tableHeader"
									size="xs"
									align="center"
								>
									Team H Players
								</Text>
							</th>
							{Array.from({ length: maxGames }, (_, idx) => (
								<th
									key={`game-head-${idx}`}
									className={`${GAME_COLUMN_WIDTH_CLASS} text-center first:text-left`}
									style={getColumnStyle(columnWidths.game)}
								>
									<Text
										as="span"
										variant="tableHeader"
										size="xs"
										align="center"
									>
										Game {idx + 1}
									</Text>
								</th>
							))}
							<th
								className={`${COLUMN_WIDTH_CLASS} text-center first:text-left`}
								style={getColumnStyle(columnWidths.winner)}
							>
								<Text
									as="span"
									variant="tableHeader"
									size="xs"
									align="center"
								>
									Winner
								</Text>
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-(--border-subtle)">
						{lines.map((line) => (
							<LineRow
								key={line.id}
								line={line}
								maxGames={maxGames}
								homeTeamId={homeTeamId}
								awayTeamId={awayTeamId}
								homeTeam={homeTeam}
								awayTeam={awayTeam}
								homePlayers={homePlayers}
								awayPlayers={awayPlayers}
								onPlayerChange={onPlayerChange}
								onGameScoreChange={onGameScoreChange}
								onWinnerChange={onWinnerChange}
								onAddGame={onAddGameToLine}
								onRemoveGame={onRemoveGameFromLine}
								columnWidths={columnWidths}
							/>
						))}
					</tbody>
				</table>
			</div>
		</section>
	);
};

export default LinesTable;
