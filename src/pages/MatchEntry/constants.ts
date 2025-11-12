export const DEFAULT_LINE_COUNT = 5;
export const DEFAULT_GAMES_PER_LINE = 3;
export const MIN_GAMES_PER_LINE = 1;
export const COLUMN_WIDTH_CLASS = "px-2 py-4 sm:px-3 sm:py-4 lg:px-5 lg:py-5";
export const LINE_COLUMN_WIDTH_CLASS =
	"px-2 py-4 sm:px-3 sm:py-4 lg:px-4 lg:py-5";
export const GAME_COLUMN_WIDTH_CLASS =
	"px-1.5 py-3 sm:px-2.5 sm:py-4 lg:px-3 lg:py-5";
export const LINE_COLUMN_WEIGHT = 8;
export const PLAYER_COLUMN_WEIGHT = 20;
export const GAME_COLUMN_WEIGHT = 12;
export const WINNER_COLUMN_WEIGHT = 20;
export const STATIC_COLUMN_WEIGHT =
	LINE_COLUMN_WEIGHT + WINNER_COLUMN_WEIGHT + PLAYER_COLUMN_WEIGHT * 2;
export const BASE_TABLE_WEIGHT =
	STATIC_COLUMN_WEIGHT + DEFAULT_GAMES_PER_LINE * GAME_COLUMN_WEIGHT;
export const FALLBACK_UNIT_WIDTH = 10;
