import type { TeamOption } from "../types";

type MatchMetaFieldsProps = {
	teams: TeamOption[];
	teamsLoading: boolean;
	homeTeamId: string;
	awayTeamId: string;
	matchDate: string;
	matchTime: string;
	location: string;
	onHomeTeamChange: (teamId: string) => void;
	onAwayTeamChange: (teamId: string) => void;
	onMatchDateChange: (value: string) => void;
	onMatchTimeChange: (value: string) => void;
	onLocationChange: (value: string) => void;
};

const MatchMetaFields = ({
	teams,
	teamsLoading,
	homeTeamId,
	awayTeamId,
	matchDate,
	matchTime,
	location,
	onHomeTeamChange,
	onAwayTeamChange,
	onMatchDateChange,
	onMatchTimeChange,
	onLocationChange,
}: MatchMetaFieldsProps) => (
	<section className="md-card p-6">
		<div className="grid gap-6 md:grid-cols-2">
			<div className="flex flex-col gap-2">
				<label className="md-field-label" htmlFor="match-home-team">
					Home Team (H)
				</label>
				<select
					id="match-home-team"
					className="md-input md-select"
					value={homeTeamId}
					onChange={(event) => onHomeTeamChange(event.target.value)}
				>
					<option value="">
						{teamsLoading ? "Loading..." : "Select"}
					</option>
					{teams.map((team) => (
						<option
							key={team.id}
							value={team.id}
							disabled={team.id === awayTeamId}
						>
							{team.name}
						</option>
					))}
				</select>
			</div>
			<div className="flex flex-col gap-2">
				<label className="md-field-label" htmlFor="match-away-team">
					Away Team (A)
				</label>
				<select
					id="match-away-team"
					className="md-input md-select"
					value={awayTeamId}
					onChange={(event) => onAwayTeamChange(event.target.value)}
				>
					<option value="">
						{teamsLoading ? "Loading..." : "Select"}
					</option>
					{teams.map((team) => (
						<option
							key={team.id}
							value={team.id}
							disabled={team.id === homeTeamId}
						>
							{team.name}
						</option>
					))}
				</select>
			</div>
		</div>

		<div className="mt-6 grid gap-6 md:grid-cols-3">
			<div className="flex flex-col gap-2">
				<label className="md-field-label" htmlFor="match-date">
					Match Date
				</label>
				<input
					id="match-date"
					type="date"
					className="md-input"
					value={matchDate}
					onChange={(event) => onMatchDateChange(event.target.value)}
				/>
			</div>
			<div className="flex flex-col gap-2">
				<label className="md-field-label" htmlFor="match-time">
					Match Time
				</label>
				<input
					id="match-time"
					type="time"
					className="md-input"
					value={matchTime}
					onChange={(event) => onMatchTimeChange(event.target.value)}
				/>
			</div>
			<div className="flex flex-col gap-2 md:col-span-1">
				<label className="md-field-label" htmlFor="match-location">
					Location
				</label>
				<input
					id="match-location"
					type="text"
					placeholder="Clubhouse courts"
					className="md-input"
					value={location}
					onChange={(event) => onLocationChange(event.target.value)}
				/>
			</div>
		</div>
	</section>
);

export default MatchMetaFields;
