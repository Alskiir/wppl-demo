import { Text, Header } from "../../../components";
import type { PartnerStats } from "../api";

type MostPlayedPartnerCardProps = {
	partner: PartnerStats | null;
};

export const MostPlayedPartnerCard = ({
	partner,
}: MostPlayedPartnerCardProps) => (
	<div className="mt-5 rounded-2xl border border-(--border-subtle) bg-(--surface-panel) px-4 py-4 shadow-(--md-sys-elevation-1) sm:max-w-sm">
		<Text variant="eyebrowMuted" size="xs">
			Most played partner
		</Text>
		{partner ? (
			<>
				<Header level={4} size="lg" className="mt-1">
					{partner.name}
				</Header>
				<Text variant="muted" size="sm" className="mt-1">
					{partner.matches} matches &mdash; {partner.wins}-
					{partner.losses} ({partner.winPct}% win rate)
				</Text>
			</>
		) : (
			<Text variant="muted" size="sm" className="mt-1">
				No partner data yet. Play a match to see this fill in.
			</Text>
		)}
	</div>
);
