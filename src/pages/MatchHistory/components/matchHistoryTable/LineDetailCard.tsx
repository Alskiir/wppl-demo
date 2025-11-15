import { Text } from "../../../../components";
import type { MatchLineDetail } from "../../types";
import { formatPlayerNames, formatScoreValue } from "./formatters";

type LineDetailCardProps = {
	line: MatchLineDetail;
	homeLabel: string;
	awayLabel: string;
	winnerName: string | null;
};

const LineDetailCard = ({
	line,
	homeLabel,
	awayLabel,
	winnerName,
}: LineDetailCardProps) => (
	<div className="rounded-lg border border-(--border-subtle) bg-(--surface-card) p-4">
		<div className="flex flex-wrap items-center justify-between gap-2">
			<div className="flex flex-col">
				<Text as="span" variant="strong" size="sm">
					Line {line.lineNumber}
				</Text>
				<Text as="span" variant="subtle" size="xs">
					{line.result === "win"
						? "Won this line"
						: line.result === "loss"
						? "Lost this line"
						: "Line tied"}
				</Text>
			</div>
			{line.winnerTeamId ? (
				<Text
					as="span"
					variant="muted"
					size="xs"
					className="rounded-full border border-(--border-subtle) px-2 py-0.5"
				>
					Winner: {winnerName ?? `#${line.winnerTeamId}`}
				</Text>
			) : null}
		</div>
		<div className="mt-3 grid gap-3 md:grid-cols-2">
			<div className="rounded-lg border border-(--border-subtle) bg-(--surface-panel) p-3">
				<Text as="span" variant="strong" size="xs">
					Home Pair
				</Text>
				<Text as="p" variant="muted" size="sm">
					{formatPlayerNames(line.homePlayers)}
				</Text>
			</div>
			<div className="rounded-lg border border-(--border-subtle) bg-(--surface-panel) p-3">
				<Text as="span" variant="strong" size="xs">
					Away Pair
				</Text>
				<Text as="p" variant="muted" size="sm">
					{formatPlayerNames(line.awayPlayers)}
				</Text>
			</div>
		</div>
		{line.games.length ? (
			<div className="mt-3 flex flex-col gap-2">
				{line.games.map((game, gameIndex) => (
					<div
						key={game.id}
						className="rounded-lg border border-(--border-subtle) bg-(--surface-panel) px-3 py-2"
					>
						<Text as="p" variant="subtle" size="xs">
							Game {gameIndex + 1}
						</Text>
						<div className="mt-1 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
							<div>
								<Text as="p" variant="strong" size="xs">
									{homeLabel}
								</Text>
								<Text as="p" variant="strong" size="lg">
									{formatScoreValue(game.homeScore)}
								</Text>
							</div>
							<div />
							<div className="text-right">
								<Text as="p" variant="strong" size="xs">
									{awayLabel}
								</Text>
								<Text as="p" variant="strong" size="lg">
									{formatScoreValue(game.awayScore)}
								</Text>
							</div>
						</div>
					</div>
				))}
			</div>
		) : (
			<Text as="p" variant="muted" size="xs" className="mt-3">
				No games recorded for this line yet.
			</Text>
		)}
	</div>
);

export default LineDetailCard;
