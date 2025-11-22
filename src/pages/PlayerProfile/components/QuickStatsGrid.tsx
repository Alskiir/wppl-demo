import { Text } from "../../../components";
import type { Stat } from "../types";

type QuickStatsGridProps = {
	stats: Stat[];
};

export const QuickStatsGrid = ({ stats }: QuickStatsGridProps) => (
	<div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
		{stats.map((stat) => (
			<div
				key={stat.label}
				className="rounded-2xl border border-(--border-subtle) bg-(--surface-panel) px-4 py-3"
			>
				<Text variant="subtle" size="sm">
					{stat.label}
				</Text>
				<Text variant="strong" size="lg" className="mt-1">
					{stat.value}
				</Text>
			</div>
		))}
	</div>
);
