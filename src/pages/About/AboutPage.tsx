import { GlassCard, PageShell } from "../../components";

const siteSections = [
	{
		title: "Home & Navigation",
		description:
			"Sticky header keeps quick links in view and welcomes visitors with a short overview so nobody gets lost on desktop or phone.",
	},
	{
		title: "Standings",
		description:
			"Pulls the Supabase view team_standings into a ready-made table, sorts by total points, and surfaces helpful error cards if credentials fail.",
	},
	{
		title: "Teams",
		description:
			"Dropdown filter feeds the TeamDetailsCard and roster table, showing contact info, roles, and player counts straight from team_membership.",
	},
	{
		title: "Match Entry",
		description:
			"Guided form collects opponents, schedule, lines, games, and winners, mirroring the sheets captains fill out after each meet.",
	},
	{
		title: "All Tables",
		description:
			"Lists every configured Supabase table (team, person, match, line_game, and more) so staff can browse raw rows without touching SQL.",
	},
];

const matchEntryHighlights = [
	"Roster dropdowns unlock only after a team is chosen, preventing away players from being mixed with home selections.",
	"Line builder adds or removes pairings, re-numbers each row, and keeps at least one line ready so the sheet always has a starting point.",
	"Game columns include plus and minus buttons beside each score, which helps tablet users update tallies without typing tiny numbers.",
	"Every edit re-checks the score math so line winners and the overall match winner are confirmed before saving.",
	"Autofill button grabs two teams and their players from Supabase, seeds believable scores, and fills the location field for quick demos.",
	"Submit button chains three Supabase inserts (match, match_line, line_game) and shows success or error banners right inside the form.",
];

const dataPractices = [
	{
		name: "React + TypeScript + Vite",
		description:
			"Typed hooks such as useMatchEntryForm and useTeamsPageData keep state predictable while Vite delivers fast refreshes during demos.",
	},
	{
		name: "Supabase-backed data",
		description:
			"The shared client in lib/supabaseClient pipes every request through resolveSupabase, so GlassCard banners can raise helpful errors and tables always get safe fallback data.",
	},
	{
		name: "Reusable layout system",
		description:
			"Navbar, PageShell, GlassCard, and the shared Table component keep spacing, tone, and interactions consistent across phones, tablets, and laptops.",
	},
	{
		name: "Utility helpers",
		description:
			"dataTransforms.ts sanitizes names, IDs, and numbers before they hit dropdowns or rows, which keeps mock data and live data interchangeable.",
	},
];

const capabilityHighlights = [
	"Keeps league directors, captains, and volunteers on one responsive site instead of juggling spreadsheets.",
	"Reads standings, rosters, and raw tables directly from Supabase and writes structured match data back the moment a form is submitted.",
	"Auto-builds tables and column orders based on whatever the database returns, so the All Tables view stays flexible.",
	"Surfaces banner messaging whenever data fails to load, giving staff clear next steps without digging into developer tools.",
	"Pairs modern styling with accessible controls (labels, focus states, inline help) so the experience works for non-technical staff.",
];

const roadmap = [
	"Push every verified roster into a MailChimp audience so directors can fire off division-wide updates without exporting CSVs.",
	"Trigger MailChimp automations whenever a match submission lands, sending recaps and reminders that reuse the Match Entry data.",
	"Use the RegistrationWorks API to import registrations directly into Supabase tables, guaranteeing that players, captains, and teams stay synchronized.",
	"Run RegistrationWorks checks when captains pick players, blocking ineligible athletes and showing a friendly GlassCard prompt inside the form.",
];

function AboutPage() {
	return (
		<PageShell
			title="About the WPPL Demo"
			description="A walk-through of how the scoring system behaves, who it helps, and which tools power it."
			maxWidthClass="max-w-5xl"
			paddingClass="px-6 md:px-10"
		>
			<GlassCard
				title="What this solves"
				description="League directors can review the latest results before planning broadcasts, captains can lock in lineups the moment play wraps, and volunteers can audit Supabase data without leaving the browser."
			/>

			<GlassCard description="WPPL Scoring System Demo keeps standings, rosters, match sheets, and database inspection tools inside one guided layout. Every screen shares the same design language, so visitors can move from checking scores to entering new ones without relearning the page." />

			<div className="grid gap-6 md:grid-cols-2">
				<GlassCard
					title="Page-by-page tour"
					listItems={siteSections.map((section) => ({
						title: section.title,
						description: section.description,
					}))}
				/>
				<GlassCard
					title="Match Entry workflow"
					description="The heaviest workflow lives on the Match Entry page, where captains record every detail from venue to game scores."
					listItems={matchEntryHighlights.map((item) => ({
						description: item,
					}))}
					listVariant="bullet"
				/>
			</div>

			<GlassCard
				title="Data + tooling"
				description="Each feature leans on a compact but production-minded toolkit:"
				listItems={dataPractices.map((tech) => ({
					title: tech.name,
					description: tech.description,
				}))}
				listColumns={2}
			/>

			<div className="grid gap-6 md:grid-cols-2">
				<GlassCard
					title="Capabilities on display"
					listItems={capabilityHighlights.map((item) => ({
						description: item,
					}))}
					listVariant="bullet"
				/>

			<GlassCard
				title="MailChimp + RegistrationWorks integrations"
				description="These integrations plug communication and registration tools straight into the existing Supabase workflow:"
				listItems={roadmap.map((item) => ({
					description: item,
				}))}
					listVariant="bullet"
				/>
			</div>
		</PageShell>
	);
}

export default AboutPage;
