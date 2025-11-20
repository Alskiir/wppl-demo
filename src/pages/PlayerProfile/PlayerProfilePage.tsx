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

type TrendPoint = {
	label: string;
	value: number;
};

type StatHighlight = {
	label: string;
	value: string;
	change: string;
	trend: "up" | "down";
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

const socialStats: Stat[] = [
	{ label: "Followers", value: "12.4K" },
	{ label: "Following", value: "312" },
	{ label: "Highlights", value: "48" },
];

const quickStats: Stat[] = [
	{ label: "Ranking", value: "#2 overall" },
	{ label: "Record", value: "18-3" },
	{ label: "Streak", value: "7 wins" },
];

const performanceTrend: TrendPoint[] = [
	{ label: "Mar", value: 62 },
	{ label: "Apr", value: 68 },
	{ label: "May", value: 72 },
	{ label: "Jun", value: 75 },
	{ label: "Jul", value: 79 },
	{ label: "Aug", value: 81 },
	{ label: "Sep", value: 84 },
	{ label: "Oct", value: 94 },
];

const statHighlights: StatHighlight[] = [
	{
		label: "Serve hold rate",
		value: "82%",
		change: "+3.4 pts vs last 8",
		trend: "up",
	},
	{
		label: "Net conversion",
		value: "71%",
		change: "+6.1 pts vs last 8",
		trend: "up",
	},
	{
		label: "Unforced errors",
		value: "6.4 / match",
		change: "-14% drop vs avg",
		trend: "down",
	},
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

const SocialStatsRow = ({ stats }: StatsGridProps) => (
	<div className="mt-2 flex flex-wrap gap-5 text-sm text-(--text-secondary)">
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

const QuickStatsGrid = ({ stats }: StatsGridProps) => (
	<div className="mt-5 grid gap-3 sm:grid-cols-3">
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

type ProfileHeroProps = {
	profile: PlayerProfile;
	socialStats: Stat[];
	quickStats: Stat[];
};

const ProfileHero = ({
	profile,
	socialStats,
	quickStats,
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

			<SocialStatsRow stats={socialStats} />
			<QuickStatsGrid stats={quickStats} />
		</div>
	</section>
);

type StatTrendChartProps = {
	data: TrendPoint[];
};

const StatTrendChart = ({ data }: StatTrendChartProps) => {
	if (!data.length) {
		return null;
	}

	const width = 920;
	const height = 260;
	const padding = { top: 14, right: 20, bottom: 42, left: 46 };
	const chartWidth = width - padding.left - padding.right;
	const chartHeight = height - padding.top - padding.bottom;
	const baselineY = height - padding.bottom;

	const values = data.map((point) => point.value);
	const baseMin = Math.min(...values);
	const baseMax = Math.max(...values);
	const paddingValue = Math.max((baseMax - baseMin) * 0.1, 4);
	const minValue = baseMin - paddingValue;
	const maxValue = baseMax + paddingValue;
	const range = Math.max(maxValue - minValue, 1);

	const points = data.map((point, index) => {
		const x =
			padding.left +
			chartWidth * (data.length === 1 ? 0.5 : index / (data.length - 1));
		const y =
			padding.top +
			chartHeight -
			((point.value - minValue) / range) * chartHeight;

		return { ...point, x, y };
	});

	const areaPath = [
		`M ${points[0].x} ${baselineY}`,
		...points.map((point) => `L ${point.x} ${point.y}`),
		`L ${points[points.length - 1].x} ${baselineY}`,
		"Z",
	].join(" ");

	const linePath = points
		.map(
			(point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
		)
		.join(" ");

	const ySteps = 4;
	const ticks = Array.from({ length: ySteps + 1 }, (_, index) => {
		const ratio = index / ySteps;
		const value = maxValue - range * ratio;
		const y = padding.top + chartHeight * ratio;

		return { y, value };
	});

	return (
		<svg
			viewBox={`0 0 ${width} ${height}`}
			role="img"
			aria-label="Player performance trend"
			className="h-full w-full"
		>
			<defs>
				<linearGradient id="trendFill" x1="0" x2="0" y1="0" y2="1">
					<stop
						offset="0%"
						stopColor="var(--accent)"
						stopOpacity="0.28"
					/>
					<stop
						offset="100%"
						stopColor="var(--accent)"
						stopOpacity="0"
					/>
				</linearGradient>
			</defs>

			{ticks.map((tick, index) => (
				<g key={tick.value + index}>
					<line
						x1={padding.left}
						x2={width - padding.right}
						y1={tick.y}
						y2={tick.y}
						stroke="var(--border-subtle)"
						strokeWidth="1"
						strokeDasharray="5 6"
						opacity={0.75}
					/>
					<text
						x={padding.left - 10}
						y={tick.y + 4}
						textAnchor="end"
						style={{
							fill: "var(--text-subtle)",
							fontSize: "11px",
							fontWeight: 600,
						}}
					>
						{Math.round(tick.value)}
					</text>
				</g>
			))}

			<path d={areaPath} fill="url(#trendFill)" />
			<path
				d={linePath}
				fill="none"
				stroke="var(--accent)"
				strokeWidth="3.5"
				strokeLinecap="round"
			/>

			{points.map((point) => (
				<g key={point.label}>
					<circle
						cx={point.x}
						cy={point.y}
						r={4.5}
						fill="var(--surface-panel)"
						stroke="var(--accent)"
						strokeWidth="2"
					/>
					<text
						x={point.x}
						y={baselineY + 18}
						textAnchor="middle"
						style={{
							fill: "var(--text-subtle)",
							fontSize: "11px",
							fontWeight: 600,
						}}
					>
						{point.label}
					</text>
				</g>
			))}
		</svg>
	);
};

const PlayerStatsGraph = () => {
	const startingPoint = performanceTrend[0];
	const latestPoint = performanceTrend[performanceTrend.length - 1];
	const delta = latestPoint.value - startingPoint.value;
	const deltaLabel = `${delta >= 0 ? "+" : ""}${delta.toFixed(1)} pts since ${
		startingPoint.label
	}`;

	return (
		<section className="md-card border border-(--border-subtle) bg-(--surface-panel) p-6 shadow-(--md-sys-elevation-1) md:p-8">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div className="space-y-2">
					<Text variant="eyebrowMuted" size="xs">
						Player performance
					</Text>
					<Header level={3} size="xl">
						Shot quality & rally control
					</Header>
					<Text variant="muted" size="sm">
						Weighted index blending serve holds, transition wins,
						and attacking points across her last eight scored
						matches.
					</Text>
				</div>
				<div className="rounded-[18px] border border-(--border-highlight) bg-(--surface-raised) px-4 py-3 text-right shadow-(--md-sys-elevation-1)">
					<Text variant="subtle" size="xs">
						Latest peak
					</Text>
					<Header level={4} size="lg" className="text-(--accent)">
						{latestPoint.value} index
					</Header>
					<Text
						variant="muted"
						size="sm"
						className="font-semibold text-(--success)"
					>
						{deltaLabel}
					</Text>
				</div>
			</div>

			<div className="mt-6 rounded-[22px] border border-(--border-subtle) bg-(--surface-card) p-4">
				<StatTrendChart data={performanceTrend} />
			</div>

			<div className="mt-6 grid gap-3 md:grid-cols-3">
				{statHighlights.map((highlight) => (
					<div
						key={highlight.label}
						className="rounded-2xl border border-(--border-subtle) bg-(--surface-panel) px-4 py-3"
					>
						<Text variant="subtle" size="xs">
							{highlight.label}
						</Text>
						<Text
							variant="strong"
							size="lg"
							className="mt-1 text-[1.25rem]"
						>
							{highlight.value}
						</Text>
						<Text
							variant="muted"
							size="sm"
							className={`mt-2 inline-flex items-center gap-2 font-semibold ${
								highlight.trend === "up"
									? "text-(--success)"
									: "text-(--danger)"
							}`}
						>
							<span
								className="inline-block h-2 w-2 rounded-full bg-current"
								aria-hidden="true"
							/>
							{highlight.change}
						</Text>
					</div>
				))}
			</div>
		</section>
	);
};

function PlayerProfilePage() {
	return (
		<PageShell
			title="Player Profile"
			description="A snapshot showing a player's profile, stats, and performance trends."
			maxWidthClass="max-w-6xl"
		>
			<div className="flex flex-col gap-6">
				<ProfileHero
					profile={playerProfile}
					socialStats={socialStats}
					quickStats={quickStats}
				/>
				<PlayerStatsGraph />
			</div>
		</PageShell>
	);
}

export default PlayerProfilePage;
