import { FilterDropdown, GlassCard, PageShell } from "../../components";
import MatchHistoryTable from "./components/MatchHistoryTable";
import { useMatchHistoryData } from "./hooks/useMatchHistoryData";

function MatchHistoryPage() {
	const {
		selectedTeamId,
		setSelectedTeamId,
		teamOptions,
		matches,
		selectedTeam,
		isLoading,
		isLoadingTeams,
		error,
	} = useMatchHistoryData();

	const hasTeams = teamOptions.length > 0;
	const selectedTeamName = selectedTeam?.name ?? "the selected team";

	let content = null;

	if (error) {
		content = (
			<GlassCard
				title="Unable to load match history"
				description={error}
				footer="Check your Supabase credentials and confirm that the match, match_line, and team tables are accessible."
			/>
		);
	} else if (!hasTeams && !isLoadingTeams) {
		content = (
			<GlassCard description="No teams are available yet. Add teams to Supabase to review their match history." />
		);
	} else if (isLoading) {
		content = <GlassCard description="Loading match history..." />;
	} else if (!matches.length) {
		content = (
			<GlassCard
				description={`No matches have been recorded for ${selectedTeamName} yet.`}
			/>
		);
	} else {
		content = (
			<MatchHistoryTable rows={matches} teamName={selectedTeam?.name} />
		);
	}

	return (
		<PageShell
			title="Match History"
			description="Select a team to review every recorded match with line scores and the points earned per meet."
			actions={
				<FilterDropdown
					label="Team"
					placeholder={
						hasTeams ? "Select Team" : "No Teams Available Yet"
					}
					value={selectedTeamId}
					onChange={(nextValue) => setSelectedTeamId(nextValue)}
					options={teamOptions}
					disabled={!hasTeams || isLoadingTeams}
				/>
			}
		>
			{content}
		</PageShell>
	);
}

export default MatchHistoryPage;
