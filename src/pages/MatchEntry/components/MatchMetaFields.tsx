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

const labelClassName =
	"text-sm font-medium uppercase tracking-wide text-[var(--text-subtle)]";
const inputClassName =
	"w-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-input)] px-4 py-3 text-[var(--text-primary)] transition-colors duration-200 focus:border-[var(--border-highlight)] focus:outline-none disabled:cursor-not-allowed disabled:border-[var(--border-subtle)] disabled:bg-[var(--surface-panel)] disabled:text-[var(--text-subtle)]";

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
	<section className="rounded-3xl border border-(--border-strong) bg-(--surface-card) p-6">
		<div className="grid gap-6 md:grid-cols-2">
			<div className="space-y-2">
				<label className={labelClassName}>Home Team (H)</label>
				<select
					className={inputClassName}
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
			<div className="space-y-2">
				<label className={labelClassName}>Away Team (A)</label>
				<select
					className={inputClassName}
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
			<div className="space-y-2">
				<label className={labelClassName}>Match Date</label>
				<input
					type="date"
					className={inputClassName}
					value={matchDate}
					onChange={(event) => onMatchDateChange(event.target.value)}
				/>
			</div>
			<div className="space-y-2">
				<label className={labelClassName}>Match Time</label>
				<input
					type="time"
					className={inputClassName}
					value={matchTime}
					onChange={(event) => onMatchTimeChange(event.target.value)}
				/>
			</div>
			<div className="space-y-2 md:col-span-1">
				<label className={labelClassName}>Location</label>
				<input
					type="text"
					placeholder="Clubhouse courts"
					className={inputClassName}
					value={location}
					onChange={(event) => onLocationChange(event.target.value)}
				/>
			</div>
		</div>
	</section>
);

export default MatchMetaFields;
