import { Header, PageShell, Text } from "../../components";

type PlayerProfile = {
	name: string;
	handle: string;
	role: string;
	team: string;
	location: string;
	joined: string;
	bio: string;
	coverImage: string;
	avatarImage: string;
};

type Stat = {
	label: string;
	value: string;
};

const playerProfile: PlayerProfile = {
	name: "Maya Ellis",
	handle: "@mayaellis",
	role: "Right-side attacker",
	team: "SoCal Waves",
	location: "San Diego, CA",
	joined: "Joined 2022",
	bio: "Aggressive third-shot drops, quick transitional defense, and a calm table-side voice make Maya the player every mixed squad wants anchoring the right half of the court.",
	coverImage:
		"https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80",
	avatarImage:
		"https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=600&q=80",
};

const quickStats: Stat[] = [
	{ label: "Ranking", value: "#2 overall" },
	{ label: "Record", value: "18-3" },
	{ label: "Streak", value: "7 wins" },
];

const socialStats: Stat[] = [
	{ label: "Followers", value: "12.4K" },
	{ label: "Following", value: "312" },
	{ label: "Highlights", value: "48" },
];

type PlayerAvatarProps = {
	src: string;
	alt: string;
};

const PlayerAvatar = ({ src, alt }: PlayerAvatarProps) => (
	<div className="h-32 w-32 overflow-hidden rounded-full border-4 border-(--surface-panel) bg-(--surface-panel) shadow-(--md-sys-elevation-1)">
		<img
			src={src}
			alt={alt}
			className="h-full w-full object-cover"
			loading="lazy"
		/>
	</div>
);

type StatsGridProps = {
	stats: Stat[];
};

const QuickStatsGrid = ({ stats }: StatsGridProps) => (
	<div className="mt-6 grid gap-3 sm:grid-cols-3">
		{stats.map((stat) => (
			<div
				key={stat.label}
				className="rounded-2xl border border-(--border-subtle) bg-(--surface-panel) px-4 py-3"
			>
				<Text variant="subtle" size="sm">
					{stat.label}
				</Text>
				<Text variant="strong" size="lg" className="mt-1">
					{stat.value}
				</Text>
			</div>
		))}
	</div>
);

const SocialStatsRow = ({ stats }: StatsGridProps) => (
	<div className="mt-6 flex flex-wrap gap-5 text-sm text-(--text-secondary)">
		{stats.map((stat) => (
			<span key={stat.label} className="flex items-center gap-1">
				<Text as="span" variant="strong" size="sm">
					{stat.value}
				</Text>
				<Text as="span" variant="muted" size="sm">
					{stat.label}
				</Text>
			</span>
		))}
	</div>
);

type ProfileHeroProps = {
	profile: PlayerProfile;
	quickStats: Stat[];
	socialStats: Stat[];
};

const ProfileHero = ({
	profile,
	quickStats,
	socialStats,
}: ProfileHeroProps) => (
	<section className="md-card p-0">
		<div className="relative h-56 w-full overflow-hidden rounded-t-(--md-sys-shape-corner-extra-large) bg-(--surface-hover)">
			<img
				src={profile.coverImage}
				alt="Player cover background"
				className="h-full w-full object-cover"
				loading="lazy"
			/>
			<div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/10 to-black/60" />
		</div>

		<div className="relative z-10 px-6 pb-8 pt-10 sm:px-10">
			<div className="-mt-16 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
					<PlayerAvatar
						src={profile.avatarImage}
						alt={`${profile.name} profile`}
					/>
					<div className="space-y-2">
						<Header level={2} variant="primary" size="lg">
							{profile.name}
						</Header>
						<Text variant="muted" size="sm">
							{profile.handle}
						</Text>
						<Text variant="subtle" size="sm">
							{profile.role}
							<span
								aria-hidden="true"
								className="mx-2 text-(--text-muted)"
							>
								|
							</span>
							{profile.team}
						</Text>
					</div>
				</div>
				<button
					type="button"
					className="inline-flex items-center justify-center rounded-full border border-(--border-subtle) px-5 py-2 text-sm font-semibold text-(--text-secondary) transition-colors duration-200 hover:border-(--accent) hover:text-(--accent)"
				>
					Follow profile
				</button>
			</div>

			<Text variant="body" size="md" className="mt-6 max-w-3xl">
				{profile.bio}
			</Text>

			<div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-(--text-secondary)">
				<span>{profile.location}</span>
				<span>{profile.joined}</span>
			</div>

			<QuickStatsGrid stats={quickStats} />
			<SocialStatsRow stats={socialStats} />
		</div>
	</section>
);

function PlayerProfilePage() {
	return (
		<PageShell
			title="Player Profile"
			description="A Twitter-style snapshot showing a player's cover art, avatar, voice, and on-court story in one stop."
			maxWidthClass="max-w-6xl"
		>
			<div className="grid gap-6 lg:grid-cols-[3fr,2fr]">
				<ProfileHero
					profile={playerProfile}
					quickStats={quickStats}
					socialStats={socialStats}
				/>
			</div>
		</PageShell>
	);
}

export default PlayerProfilePage;
