import { Header, Text } from "../../../components";
import type { PartnerStats } from "../api";
import type { PlayerProfile, Stat } from "../types";
import { PlayerAvatar } from "./PlayerAvatar";
import { SocialStatsRow } from "./SocialStatsRow";
import { QuickStatsGrid } from "./QuickStatsGrid";
import { MostPlayedPartnerCard } from "./MostPlayedPartnerCard";

type ProfileHeroProps = {
	profile: PlayerProfile;
	socialStats: Stat[];
	quickStats: Stat[];
	partner: PartnerStats | null;
};

export const ProfileHero = ({
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
