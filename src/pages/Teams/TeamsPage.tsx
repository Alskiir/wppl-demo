import { useMemo, useState } from "react";
import { FilterDropdown, GlassCard, PageShell, Table } from "../../components";
import {
	divisions,
	players,
	seasons,
	teams,
	type Player,
} from "../../data/mockLeague";

function Teams() {
	const [selectedTeamId, setSelectedTeamId] = useState<number | null>(
		teams.length ? teams[0].id : null
	);

	const teamOptions = useMemo(
		() =>
			teams.map((team) => ({
				value: String(team.id),
				label: team.name,
			})),
		[]
	);

	const selectedTeam = useMemo(() => {
		if (selectedTeamId === null) return undefined;
		return teams.find((team) => team.id === selectedTeamId);
	}, [selectedTeamId]);

	const relatedDivision = useMemo(() => {
		if (!selectedTeam) return undefined;
		return divisions.find(
			(division) => division.id === selectedTeam.divisionId
		);
	}, [selectedTeam]);

	const relatedSeason = useMemo(() => {
		if (!selectedTeam) return undefined;
		return seasons.find((season) => season.id === selectedTeam.seasonId);
	}, [selectedTeam]);

	const captain = useMemo(() => {
		if (!selectedTeam) return undefined;
		return players.find((player) => player.id === selectedTeam.captainId);
	}, [selectedTeam]);

	const teamPlayers = useMemo(() => {
		if (!selectedTeam) return [];
		return selectedTeam.playerIds
			.map((playerId) => players.find((player) => player.id === playerId))
			.filter((player): player is Player => Boolean(player));
	}, [selectedTeam]);

	const tableData = useMemo(
		() =>
			teamPlayers.map((player) => [
				`${player.firstName} ${player.lastName}`,
				player.rating.toFixed(1),
				player.email,
				player.phone,
				player.homeClub,
			]),
		[teamPlayers]
	);

	return (
		<PageShell
			title="Teams"
			description="Select a roster to explore player profiles and coaching insight."
			actions={
				<FilterDropdown
					label="Team"
					placeholder="Select Team"
					value={selectedTeamId ? String(selectedTeamId) : null}
					onChange={(nextValue) =>
						setSelectedTeamId(nextValue ? Number(nextValue) : null)
					}
					options={teamOptions}
					className="md:w-56 md:max-w-none!"
				/>
			}
		>
			{selectedTeam ? (
				<div className="flex flex-col gap-6">
					<GlassCard
						title={selectedTeam.name}
						description={`${
							relatedDivision?.name ?? "Independent"
						} - ${relatedSeason?.name ?? "Season TBD"}`}
						details={[
							{
								label: "Captain",
								value: captain
									? `${captain.firstName} ${captain.lastName}`
									: "-",
							},
							{
								label: "Home Court",
								value: selectedTeam.homeCourt,
							},
						]}
					/>

					<Table
						headers={[
							"Player",
							"Rating",
							"Email",
							"Phone",
							"Home Club",
						]}
						data={tableData}
						className="rounded-2xl border border-neutral-800/60 bg-neutral-900/60 shadow-[0_12px_30px_rgba(15,23,42,0.35)] backdrop-blur"
					/>
				</div>
			) : (
				<GlassCard description="Choose a team to view roster details." />
			)}
		</PageShell>
	);
}

export default Teams;
