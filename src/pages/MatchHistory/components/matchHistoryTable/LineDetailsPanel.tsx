import { Text } from "../../../../components";
import type { MatchHistoryEntry, MatchLineDetail } from "../../types";
import LineDetailCard from "./LineDetailCard";

type LineDetailsPanelProps = {
	match: MatchHistoryEntry;
	teamName: string;
	onClose: () => void;
};

const resolveWinnerName = (
	line: MatchLineDetail,
	match: MatchHistoryEntry,
	teamName: string
) => {
	if (!line.winnerTeamId) {
		return null;
	}

	if (line.winnerTeamId === match.teamId) {
		return teamName;
	}

	if (line.winnerTeamId === match.opponentId) {
		return match.opponentName;
	}

	return null;
};

const LineDetailsPanel = ({
	match,
	teamName,
	onClose,
}: LineDetailsPanelProps) => {
	const homeLabel = match.isHomeMatch ? teamName : match.opponentName;
	const awayLabel = match.isHomeMatch ? match.opponentName : teamName;
	const locationLabel = match.location?.trim() || "Location TBD";

	return (
		<div className="rounded-xl border border-(--border-default) bg-(--surface-panel) p-4 shadow-sm">
			<div className="flex flex-wrap items-center justify-between gap-2">
				<div className="flex flex-col">
					<Text as="span" variant="strong" size="sm">
						Line breakdown vs {match.opponentName}
					</Text>
					<Text as="span" variant="muted" size="xs">
						View the pairs, individual games, and winners captured
						when this match was recorded.
					</Text>
				</div>
				<button
					type="button"
					onClick={onClose}
					className="rounded-full border border-(--border-subtle) px-3 py-1 text-xs font-semibold uppercase tracking-wide text-(--text-muted) transition-colors hover:bg-(--surface-hover)"
				>
					Hide details
				</button>
			</div>
			<div className="mt-3 flex flex-wrap gap-x-8 gap-y-3">
				{[
					{ label: "Location", value: locationLabel },
					{ label: "Home Team", value: homeLabel },
					{ label: "Away Team", value: awayLabel },
				].map(({ label, value }) => (
					<div key={label}>
						<Text
							as="span"
							variant="subtle"
							size="xs"
							className="block uppercase tracking-[0.2em]"
						>
							{label}
						</Text>
						<Text
							as="span"
							variant="strong"
							size="sm"
							className="block"
						>
							{value}
						</Text>
					</div>
				))}
			</div>
			{match.lines.length ? (
				<div className="mt-4 grid gap-4 md:grid-cols-2">
					{match.lines.map((line) => (
						<LineDetailCard
							key={line.id}
							line={line}
							homeLabel={homeLabel}
							awayLabel={awayLabel}
							winnerName={resolveWinnerName(
								line,
								match,
								teamName
							)}
						/>
					))}
				</div>
			) : (
				<Text as="p" variant="muted" size="sm" className="mt-4">
					No line breakdown has been logged for this match.
				</Text>
			)}
		</div>
	);
};

export default LineDetailsPanel;
