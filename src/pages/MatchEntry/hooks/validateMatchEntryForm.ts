import type { LineFormState } from "../types";

type FormValidationArgs = {
	lines: LineFormState[];
	homeTeamId: string;
	awayTeamId: string;
	matchDate: string;
	matchTime: string;
	location: string;
};

export const validateMatchEntryForm = ({
	lines,
	homeTeamId,
	awayTeamId,
	matchDate,
	matchTime,
	location,
}: FormValidationArgs) => {
	const errors: string[] = [];
	if (!homeTeamId) errors.push("Select a home team.");
	if (!awayTeamId) errors.push("Select an away team.");
	if (homeTeamId && awayTeamId && homeTeamId === awayTeamId) {
		errors.push("Home and away teams must be different.");
	}
	if (!matchDate) errors.push("Provide a match date.");
	if (!matchTime) errors.push("Provide a start time.");
	if (!location.trim()) errors.push("Enter the match location.");

	lines.forEach((line) => {
		if (!line.teamA.player1Id || !line.teamA.player2Id) {
			errors.push(`Line ${line.lineNumber}: select both away players.`);
		}
		if (!line.teamH.player1Id || !line.teamH.player2Id) {
			errors.push(`Line ${line.lineNumber}: select both home players.`);
		}

		line.games.forEach((game, idx) => {
			if (game.away === "" || game.home === "") {
				errors.push(
					`Line ${line.lineNumber}: enter scores for Game ${idx + 1}.`
				);
			}
		});

		if (!line.winnerTeamId) {
			errors.push(
				`Line ${line.lineNumber}: winner missing or tie detected.`
			);
		}
	});

	return errors;
};
