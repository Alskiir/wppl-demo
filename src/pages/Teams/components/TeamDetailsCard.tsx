import { GlassCard } from "../../../components";
import type { TeamRecord } from "../types";

type TeamDetailsCardProps = {
	team: TeamRecord;
	rosterCount: number;
};

function TeamDetailsCard({ team, rosterCount }: TeamDetailsCardProps) {
	const description = team.location ?? "Team roster powered by PostgreSQL.";

	return (
		<GlassCard
			title={team.name}
			description={description}
			details={[
				{
					label: "Location",
					value: team.location ?? "-",
				},
				{
					label: "Players",
					value: rosterCount ? String(rosterCount) : "-",
				},
			]}
		/>
	);
}

export default TeamDetailsCard;
