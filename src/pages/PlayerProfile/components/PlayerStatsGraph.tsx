import { Header, Text } from "../../../components";
import type { TrendPoint, StatHighlight } from "../types";
import { StatTrendChart } from "./StatTrendChart";

type PlayerStatsGraphProps = {
	trend: TrendPoint[];
	statHighlights: StatHighlight[];
};

export const PlayerStatsGraph = ({
	trend,
	statHighlights,
}: PlayerStatsGraphProps) => {
	if (!trend.length) {
		return null;
	}

	const startingPoint = trend[0];
	const latestPoint = trend[trend.length - 1];
	const delta = latestPoint.value - startingPoint.value;
	const deltaLabel = `${delta >= 0 ? "+" : ""}${delta.toFixed(1)} pts since ${
		startingPoint.label
	}`;

	return (
		<section className="md-card border border-(--border-subtle) bg-(--surface-panel) p-6 shadow-(--md-sys-elevation-1) md:p-8">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div className="space-y-2">
					<Text variant="eyebrowMuted" size="xs">
						Performance overview
					</Text>
					<Header level={3} size="xl">
						Point differential per match
					</Header>
					<Text variant="muted" size="sm">
						Point differential across the most recent matches
						played.
					</Text>
				</div>
				<div className="rounded-[18px] border border-(--border-highlight) bg-(--surface-raised) px-4 py-3 text-right shadow-(--md-sys-elevation-1)">
					<Text variant="subtle" size="xs">
						Last result differential
					</Text>
					<Header level={4} size="lg" className="text-(--accent)">
						{latestPoint.value > 0 ? "+" : ""}
						{latestPoint.value} pts
					</Header>
					<Text
						variant="muted"
						size="sm"
						className={`font-semibold ${
							delta >= 0 ? "text-(--success)" : "text-(--danger)"
						}`}
					>
						{deltaLabel}
					</Text>
				</div>
			</div>

			<div className="mt-6 rounded-[22px] border border-(--border-subtle) bg-(--surface-card) p-4">
				<StatTrendChart data={trend} />
			</div>

			<div className="mt-6 grid gap-3 md:grid-cols-3">
				{statHighlights.map((highlight) => (
					<div
						key={highlight.label}
						className="rounded-2xl border border-(--border-subtle) bg-(--surface-panel) px-4 py-3"
					>
						<Text variant="subtle" size="xs">
							{highlight.label}
						</Text>
						<Text
							variant="strong"
							size="lg"
							className="mt-1 text-[1.25rem]"
						>
							{highlight.value}
						</Text>
						<Text
							variant="muted"
							size="sm"
							className={`mt-2 inline-flex items-center gap-2 font-semibold ${
								highlight.trend === "up"
									? "text-(--success)"
									: "text-(--danger)"
							}`}
						>
							<span
								className="inline-block h-2 w-2 rounded-full bg-current"
								aria-hidden="true"
							/>
							{highlight.change}
						</Text>
					</div>
				))}
			</div>
		</section>
	);
};
