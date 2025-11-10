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
								? "border-emerald-400/70 text-emerald-100"
								: "border-red-500/70 text-red-100"
						}`}
					>
						{toast.message}
					</div>
				) : null}

				{validationErrors.length ? (
					<div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-100">
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
						className="rounded-2xl border border-white/15 px-4 py-2 text-sm text-white transition hover:border-cyan-300 hover:text-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
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
						className="rounded-2xl border border-cyan-400/70 bg-linear-to-r from-cyan-500/30 to-blue-600/30 px-8 py-3 text-sm font-semibold text-white transition hover:from-cyan-500/40 hover:to-blue-600/40 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{isSubmitting ? "Saving..." : "Submit Match"}
					</button>
				</div>
			</form>
		</PageShell>
	);
};

export default MatchEntryPage;
