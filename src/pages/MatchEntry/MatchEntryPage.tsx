import MatchMetaFields from "./components/MatchMetaFields";
import LinesTable from "./components/LinesTable";
import { useMatchEntryForm } from "./hooks/useMatchEntryForm";
import { PageShell } from "../../components";

const MatchEntryPage = () => {
	const {
		matchTitle,
		toast,
		validationErrors,
		handleSubmit,
		isSubmitting,
		autofillMatch,
		isAutofilling,
		teams,
		teamsLoading,
		homeTeamId,
		awayTeamId,
		matchDate,
		matchTime,
		location,
		setMatchDate,
		setMatchTime,
		setLocation,
		handleHomeTeamChange,
		handleAwayTeamChange,
		lines,
		maxGames,
		homePlayers,
		awayPlayers,
		addLine,
		removeLine,
		addGameToLine,
		removeGameFromLine,
		handlePlayerChange,
		handleGameScoreChange,
		handleWinnerChange,
		homeTeam,
		awayTeam,
	} = useMatchEntryForm();

	return (
		<PageShell
			title={matchTitle}
			description="Enter WPPL match results, lineups, and per-game scores. Winners auto-calculate but stay editable."
			maxWidthClass="max-w-7xl"
		>
			<form className="space-y-10" onSubmit={handleSubmit}>
				{toast ? (
					<div
						className={`rounded-2xl border px-4 py-3 text-sm ${
							toast.type === "success"
								? "border-(--success) bg-[#11211a] text-(--success)"
								: "border-(--danger) bg-[#2a1219] text-(--danger)"
						}`}
					>
						{toast.message}
					</div>
				) : null}

				{validationErrors.length ? (
					<div className="rounded-2xl border border-(--danger) bg-[#2a1219] p-4 text-sm text-(--danger)">
						<ul className="list-disc space-y-1 pl-5">
							{validationErrors.map((error) => (
								<li key={error}>{error}</li>
							))}
						</ul>
					</div>
				) : null}

				<div className="flex justify-end">
					<button
						type="button"
						onClick={autofillMatch}
						disabled={isAutofilling || isSubmitting}
						className="rounded-2xl border border-(--border-subtle) bg-(--surface-card) px-4 py-2 text-sm text-(--text-secondary) transition-colors duration-200 hover:border-(--border-highlight) hover:text-(--accent) disabled:cursor-not-allowed disabled:opacity-50"
					>
						{isAutofilling
							? "Autofilling..."
							: "Autofill From Database"}
					</button>
				</div>

				<MatchMetaFields
					teams={teams}
					teamsLoading={teamsLoading}
					homeTeamId={homeTeamId}
					awayTeamId={awayTeamId}
					matchDate={matchDate}
					matchTime={matchTime}
					location={location}
					onHomeTeamChange={handleHomeTeamChange}
					onAwayTeamChange={handleAwayTeamChange}
					onMatchDateChange={setMatchDate}
					onMatchTimeChange={setMatchTime}
					onLocationChange={setLocation}
				/>

				<LinesTable
					lines={lines}
					maxGames={maxGames}
					homeTeamId={homeTeamId}
					awayTeamId={awayTeamId}
					homeTeam={homeTeam}
					awayTeam={awayTeam}
					homePlayers={homePlayers}
					awayPlayers={awayPlayers}
					onAddLine={addLine}
					onRemoveLine={removeLine}
					onAddGameToLine={addGameToLine}
					onRemoveGameFromLine={removeGameFromLine}
					onPlayerChange={handlePlayerChange}
					onGameScoreChange={handleGameScoreChange}
					onWinnerChange={handleWinnerChange}
				/>

				<div className="flex justify-end">
					<button
						type="submit"
						disabled={isSubmitting}
						className="rounded-2xl border border-(--accent-strong) bg-(--accent-strong) px-8 py-3 text-sm font-semibold text-(--text-inverse) transition-colors duration-200 hover:bg-(--accent) disabled:cursor-not-allowed disabled:opacity-60"
					>
						{isSubmitting ? "Saving..." : "Submit Match"}
					</button>
				</div>
			</form>
		</PageShell>
	);
};

export default MatchEntryPage;
