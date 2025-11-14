import { GlassCard, PageShell } from "../../components";
import { TeamDetailsCard, TeamFilter, TeamRosterTable } from "./components";
import { useTeamsPageData } from "./hooks/useTeamsPageData";

function TeamsPage() {
	const {
		teams,
		teamOptions,
		selectedTeamId,
		setSelectedTeamId,
		teamDetails,
		roster,
		rosterCount,
		isLoadingTeams,
		isLoading,
		error,
	} = useTeamsPageData();

	const hasTeams = teams.length > 0;
	const showRoster =
		!isLoading && !error && selectedTeamId && teamDetails !== null;

	return (
		<PageShell
			title="Teams"
			description="Select a roster to explore team members and details."
			actions={
				<TeamFilter
					value={selectedTeamId}
					onChange={(nextValue) => setSelectedTeamId(nextValue)}
					options={teamOptions}
					disabled={isLoadingTeams || !hasTeams}
				/>
			}
		>
			{error ? (
				<GlassCard
					title="Something went wrong"
					description={error}
					footer="Confirm credentials are configured in the .env file."
				/>
			) : isLoading ? (
				<GlassCard description="Loading team information..." />
			) : showRoster && teamDetails ? (
				<div className="flex flex-col gap-6">
					<TeamDetailsCard
						team={teamDetails}
						rosterCount={rosterCount}
					/>
					<TeamRosterTable roster={roster} />
				</div>
			) : (
				<GlassCard description="Choose a team to view roster details." />
			)}
		</PageShell>
	);
}

export default TeamsPage;
