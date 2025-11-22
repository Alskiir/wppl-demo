import { useSearchParams } from "react-router-dom";
import { BaseCard, PageShell } from "../../components";
import { DEFAULT_PLAYER_ID } from "./constants";
import { usePlayerStats } from "./hooks/usePlayerStats";
import { usePlayerProfile } from "./hooks/usePlayerProfile";
import { ProfileHero, PlayerStatsGraph } from "./components";

function PlayerProfilePage() {
	const [searchParams] = useSearchParams();
	const playerId = searchParams.get("playerId") ?? DEFAULT_PLAYER_ID;
	const { stats, error, loading } = usePlayerStats(playerId);
	const { profile, quickStats, socialStats, trend, statHighlights, partner } =
		usePlayerProfile(stats);

	const hasStats = Boolean(stats);
	const hasMatches = Boolean(stats && stats.totalMatches > 0);

	let content = null;

	if (error) {
		content = (
			<BaseCard
				title="Unable to load player data"
				description={error}
				footer="Confirm the player id is valid and that Supabase credentials are set in .env."
			/>
		);
	} else if (loading) {
		content = <BaseCard description="Loading player data..." />;
	} else if (!hasStats || !profile) {
		content = (
			<BaseCard description="Add ?playerId=<person id> to load player data." />
		);
	} else {
		content = (
			<div className="flex flex-col gap-6">
				<ProfileHero
					profile={profile}
					socialStats={socialStats}
					quickStats={quickStats}
					partner={partner}
				/>
				{hasMatches ? (
					<PlayerStatsGraph
						trend={trend}
						statHighlights={statHighlights}
					/>
				) : (
					<BaseCard description="No match data recorded for this player yet." />
				)}
			</div>
		);
	}

	return (
		<PageShell
			title="Player Profile"
			description="A snapshot showing a player's profile, stats, and performance trends."
			maxWidthClass="max-w-6xl"
		>
			{content}
		</PageShell>
	);
}

export default PlayerProfilePage;
