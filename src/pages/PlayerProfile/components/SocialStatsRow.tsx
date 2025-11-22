import { Text } from "../../../components";
import type { Stat } from "../types";

type SocialStatsRowProps = {
	stats: Stat[];
};

export const SocialStatsRow = ({ stats }: SocialStatsRowProps) => (
	<div className="mt-2 flex flex-wrap gap-5 text-sm text-(--text-secondary)">
		{stats.map((stat) => (
			<span key={stat.label} className="flex items-center gap-1">
				<Text as="span" variant="strong" size="sm">
					{stat.value}
				</Text>
				<Text as="span" variant="muted" size="sm">
					{stat.label}
				</Text>
			</span>
		))}
	</div>
);
