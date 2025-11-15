import type { RawMatchHistoryRow } from "../../data/matchHistory";
import type { TeamSelectOption } from "../../types/league";

export type TeamOption = TeamSelectOption;

export type MatchResult = "win" | "loss" | "tie";

export type MatchLineGame = {
	id: string;
	homeScore: number | null;
	awayScore: number | null;
};

export type MatchLineDetail = {
	id: string;
	lineNumber: number;
	winnerTeamId: string | null;
	result: MatchResult;
	games: MatchLineGame[];
};

export type MatchHistoryEntry = {
	id: string;
	matchDate: string;
	matchTime: string | null;
	location: string | null;
	opponentName: string;
	opponentId: string;
	isHomeMatch: boolean;
	teamScore: number;
	opponentScore: number;
	result: MatchResult;
	pointsEarned: number;
	gamesWon: number;
	gamesLost: number;
	lines: MatchLineDetail[];
};

export type RawMatchHistory = RawMatchHistoryRow;
