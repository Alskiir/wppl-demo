export type PlayerProfile = {
	name: string;
	handle: string;
	role: string;
	team: string;
	location: string;
	joined: string;
	bio: string | null;
	coverImage: string;
	avatarImage: string;
};

export type Stat = {
	label: string;
	value: string;
};

export type TrendPoint = {
	label: string;
	value: number;
};

export type StatHighlight = {
	label: string;
	value: string;
	change: string;
	trend: "up" | "down";
};
