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
			description="Enter match results, lineups, and per-game scores. Winners auto-calculate but stay editable."
			maxWidthClass="max-w-7xl"
		>
			<form className="space-y-10" onSubmit={handleSubmit}>
				{toast ? (
					<div
						className={`md-banner text-sm ${
							toast.type === "success"
								? "md-banner--success"
								: "md-banner--danger"
						}`}
					>
						{toast.message}
					</div>
				) : null}

				{validationErrors.length ? (
					<div className="md-banner md-banner--danger text-sm">
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
						className="md-tonal-button text-sm"
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
						className="md-filled-button px-8 text-sm"
					>
						{isSubmitting ? "Saving..." : "Submit Match"}
					</button>
				</div>
			</form>
		</PageShell>
	);
};

export default MatchEntryPage;
