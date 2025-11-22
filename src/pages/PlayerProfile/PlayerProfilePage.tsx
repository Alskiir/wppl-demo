import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BaseCard, Header, PageShell, Text } from "../../components";
import {
	fetchPlayerComputedStats,
	type PartnerStats,
	type PlayerComputedStats,
} from "./api";

const DEFAULT_PLAYER_ID = import.meta.env.VITE_DEFAULT_PLAYER_ID ?? "";
const DEFAULT_PROFILE_COPY = {
	role: "League player",
	coverImage:
		"https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80",
	avatarImage:
		"https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=600&q=80",
};

type PlayerProfile = {
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

type MostPlayedPartnerProps = {
	partner: PartnerStats | null;
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

const MostPlayedPartnerCard = ({ partner }: MostPlayedPartnerProps) => (
	<div className="mt-5 rounded-2xl border border-(--border-subtle) bg-(--surface-panel) px-4 py-4 shadow-(--md-sys-elevation-1) sm:max-w-sm">
		<Text variant="eyebrowMuted" size="xs">
			Most played partner
		</Text>
		{partner ? (
			<>
				<Header level={4} size="lg" className="mt-1">
					{partner.name}
				</Header>
				<Text variant="muted" size="sm" className="mt-1">
					{partner.matches} matches &mdash; {partner.wins}-
					{partner.losses} ({partner.winPct}% win rate)
				</Text>
			</>
		) : (
			<Text variant="muted" size="sm" className="mt-1">
				No partner data yet. Play a match to see this fill in.
			</Text>
		)}
	</div>
);

const QuickStatsGrid = ({ stats }: StatsGridProps) => (
	<div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
	partner: PartnerStats | null;
};

const ProfileHero = ({
	profile,
	socialStats,
	quickStats,
	partner,
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

			{profile.bio ? (
				<Text variant="body" size="md" className="mt-6 max-w-3xl">
					{profile.bio}
				</Text>
			) : (
				<Text variant="subtle" size="sm" className="mt-6 max-w-3xl">
					No bio available.
				</Text>
			)}

			<div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-(--text-secondary)">
				<span>{profile.location}</span>
				<span>{profile.joined}</span>
			</div>

			<SocialStatsRow stats={socialStats} />
			<QuickStatsGrid stats={quickStats} />
			<MostPlayedPartnerCard partner={partner} />
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
			aria-label="Point differential trend"
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

type PlayerStatsGraphProps = {
	trend: TrendPoint[];
	statHighlights: StatHighlight[];
};

const PlayerStatsGraph = ({ trend, statHighlights }: PlayerStatsGraphProps) => {
	if (!trend.length) {
		return null;
	}

	const startingPoint = trend[0];
	const latestPoint = trend[trend.length - 1];
	const delta = latestPoint.value - startingPoint.value;
	const deltaLabel = `${delta >= 0 ? "+" : ""}${delta.toFixed(1)} pts since ${
		startingPoint.label
	}`;

	return (
		<section className="md-card border border-(--border-subtle) bg-(--surface-panel) p-6 shadow-(--md-sys-elevation-1) md:p-8">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div className="space-y-2">
					<Text variant="eyebrowMuted" size="xs">
						Performance overview
					</Text>
					<Header level={3} size="xl">
						Point differential per match
					</Header>
					<Text variant="muted" size="sm">
						Point differential across the most recent matches
						played.
					</Text>
				</div>
				<div className="rounded-[18px] border border-(--border-highlight) bg-(--surface-raised) px-4 py-3 text-right shadow-(--md-sys-elevation-1)">
					<Text variant="subtle" size="xs">
						Last result differential
					</Text>
					<Header level={4} size="lg" className="text-(--accent)">
						{latestPoint.value > 0 ? "+" : ""}
						{latestPoint.value} pts
					</Header>
					<Text
						variant="muted"
						size="sm"
						className={`font-semibold ${
							delta >= 0 ? "text-(--success)" : "text-(--danger)"
						}`}
					>
						{deltaLabel}
					</Text>
				</div>
			</div>

			<div className="mt-6 rounded-[22px] border border-(--border-subtle) bg-(--surface-card) p-4">
				<StatTrendChart data={trend} />
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

const formatSigned = (value: number, suffix = "") => {
	const rounded = Number(value.toFixed(2));
	const prefix = rounded > 0 ? "+" : "";
	return `${prefix}${rounded}${suffix}`;
};

const isValidUuid = (value: string) =>
	/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
		value.trim()
	);

function PlayerProfilePage() {
	const [searchParams] = useSearchParams();
	const playerId = searchParams.get("playerId") ?? DEFAULT_PLAYER_ID;
	const [stats, setStats] = useState<PlayerComputedStats | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;
		if (!playerId) {
			setStats(null);
			setError("Add ?playerId=<person id> to load real player data.");
			setLoading(false);
			return;
		}

		if (!isValidUuid(playerId)) {
			setStats(null);
			setError("Player id must be a valid UUID.");
			setLoading(false);
			return;
		}

		setLoading(true);
		setStats(null);
		setError(null);

		fetchPlayerComputedStats(playerId)
			.then((result) => {
				if (!cancelled) {
					setStats(result);
				}
			})
			.catch((err) => {
				if (!cancelled) {
					setError(
						err instanceof Error
							? err.message
							: "Unable to load player data."
					);
					setStats(null);
				}
			})
			.finally(() => {
				if (!cancelled) {
					setLoading(false);
				}
			});

		return () => {
			cancelled = true;
		};
	}, [playerId]);

	const profile: PlayerProfile | null = useMemo(() => {
		if (!stats) {
			return null;
		}

		return {
			name: stats.basics.fullName,
			handle: stats.basics.handle,
			role: DEFAULT_PROFILE_COPY.role,
			team: stats.basics.teamName,
			location: stats.basics.teamLocation,
			joined: stats.basics.joinedLabel,
			bio: stats.basics.bio,
			coverImage:
				stats.basics.coverUrl ?? DEFAULT_PROFILE_COPY.coverImage,
			avatarImage:
				stats.basics.avatarUrl ?? DEFAULT_PROFILE_COPY.avatarImage,
		};
	}, [stats]);

	const quickStats: Stat[] = useMemo(() => {
		if (!stats) return [];
		return [
			{ label: "Win percentage", value: `${stats.winPercentage}%` },
			{
				label: "Current win streak",
				value: `${stats.winStreak} match${
					stats.winStreak === 1 ? "" : "es"
				}`,
			},
			{
				label: "Highest win streak",
				value: `${stats.highestWinStreak} match${
					stats.highestWinStreak === 1 ? "" : "es"
				}`,
			},
			{ label: "Total matches", value: `${stats.totalMatches} played` },
		];
	}, [stats]);

	const socialStats: Stat[] = useMemo(() => {
		if (!stats) return [];
		return [
			{ label: "Games won", value: `${stats.gamesWon}` },
			{ label: "Games lost", value: `${stats.gamesLost}` },
			{
				label: "Lines won / match",
				value: `${stats.linesPerMatch.toFixed(2)} avg`,
			},
		];
	}, [stats]);

	const trend: TrendPoint[] = useMemo(() => stats?.trend ?? [], [stats]);

	const statHighlights: StatHighlight[] = useMemo(() => {
		if (!stats) return [];
		return [
			{
				label: "Average point differential",
				value: `${formatSigned(stats.avgPointDifferential, " pts")}`,
				change: stats.trend.length
					? `Across the last ${stats.trend.length} matches`
					: "Across recorded matches",
				trend: stats.avgPointDifferential >= 0 ? "up" : "down",
			},
			{
				label: "Games won vs lost",
				value: `${stats.gamesWon} / ${stats.gamesLost}`,
				change: `${stats.gamesWon + stats.gamesLost} total games`,
				trend: stats.winStreak > 0 ? "up" : "down",
			},
			{
				label: "Lines won per match",
				value: `${stats.linesPerMatch.toFixed(2)} avg`,
				change: formatSigned(
					stats.linesPerMatch - 1,
					" vs league average"
				),
				trend: stats.linesPerMatch >= 1 ? "up" : "down",
			},
		];
	}, [stats]);

	const partner: PartnerStats | null = stats?.partner ?? null;

	const hasStats = Boolean(stats);
	const hasMatches = Boolean(stats && stats.totalMatches > 0);

	let content = null;

	if (error) {
		content = (
			<BaseCard
				title="Unable to load player data"
				description={error}
				footer="Confirm the player id is valid and that Supabase credentials are set in .env."
			/>
		);
	} else if (loading) {
		content = <BaseCard description="Loading player data..." />;
	} else if (!hasStats || !profile) {
		content = (
			<BaseCard description="Add ?playerId=<person id> to load player data." />
		);
	} else {
		content = (
			<div className="flex flex-col gap-6">
				<ProfileHero
					profile={profile}
					socialStats={socialStats}
					quickStats={quickStats}
					partner={partner}
				/>
				{hasMatches ? (
					<PlayerStatsGraph
						trend={trend}
						statHighlights={statHighlights}
					/>
				) : (
					<BaseCard description="No match data recorded for this player yet." />
				)}
			</div>
		);
	}

	return (
		<PageShell
			title="Player Profile"
			description="A snapshot showing a player's profile, stats, and performance trends."
			maxWidthClass="max-w-6xl"
		>
			{content}
		</PageShell>
	);
}

export default PlayerProfilePage;
