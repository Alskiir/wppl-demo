import { BaseCard, PageShell } from "../../components";

const pageSummaries = [
	{
		title: "Home",
		description:
			"A short welcome with links to every part of the demo so people can move around without hunting for menus.",
	},
	{
		title: "Standings",
		description:
			"Shows the league table sorted by points. If data is missing or slow to load, the page explains what to check next.",
	},
	{
		title: "Teams",
		description:
			"Pick a team to see a quick profile plus a roster table. The picker stays in place so you can jump between teams fast.",
	},
	{
		title: "Match History",
		description:
			"Select any team to read every recorded match, including line scores and points earned for that meet.",
	},
	{
		title: "Match Entry",
		description:
			"A guided form for captains to log opponents, dates, lineups, and game scores without needing a spreadsheet.",
	},
	{
		title: "All Tables",
		description:
			"Browse the raw data from the database (teams, people, matches, lines, and more) with a dropdown and sortable table.",
	},
	{
		title: "About",
		description:
			"The page you are reading now: an overview of how the demo works and how it protects your time.",
	},
];

const matchEntryHighlights = [
	"Team dropdowns only unlock the rosters for the team you picked, so home and away lineups do not get crossed.",
	"A line builder lets you add or remove pairings while keeping the numbering tidy and always leaving at least one line in place.",
	"Each game has plus and minus buttons next to the scores, making it easy to update on a phone or tablet.",
	"The page checks the math after every change so line winners and the overall winner stay accurate before you submit.",
	"Autofill can pull two sample teams from the database, set likely scores, and fill the location to speed up demos.",
	"Submit saves the match, the lines, and each game in one go and shows a clear success or error banner on the spot.",
];

const dataPractices = [
	{
		name: "Built for quick visits",
		description:
			"React, TypeScript, and Vite keep the experience snappy while typed hooks reduce surprises as the app grows.",
	},
	{
		name: "One data source",
		description:
			"All reads and writes go through the Postgres database, with friendly error messages when something blocks a request.",
	},
	{
		name: "Consistent layout",
		description:
			"Shared pieces like the navbar, PageShell, BaseCard, and Table keep spacing, tone, and controls familiar on every page.",
	},
	{
		name: "Cleaned inputs",
		description:
			"Names, IDs, and numbers are trimmed and checked before they reach dropdowns or tables, keeping fake and real data aligned.",
	},
];

const cachingNotes = [
	"Standings and the team list keep a fresh copy in memory for around 5–10 minutes, so moving between pages does not trigger constant reloads.",
	"Team details, rosters, match history, and the All Tables view refresh roughly every 2 minutes or whenever you hit Refresh.",
	"Match Entry remembers any roster it has already pulled during your visit, so switching between teams stays quick even on slower connections.",
	"If a refresh fails, pages keep showing the last successful data and explain what to check next instead of leaving an empty screen.",
];

function AboutPage() {
	return (
		<PageShell
			title="About the Scoring System Demo"
			description={
				<>
					This demo shows how league staff can check scores, manage
					rosters, and enter matches in one place without juggling
					spreadsheets. Every page follows the same simple layout so
					new visitors can move from reading results to adding them
					with no training.
					<hr className="my-3 w-150 h-px bg-(--border-subtle) border- not-md:w-75" />
					Use this overview to see what each page does and how the app
					keeps data fast and reliable behind the scenes.
				</>
			}
			descriptionAs="div"
			maxWidthClass="max-w-5xl"
			paddingClass="px-6 md:px-10"
		>
			<div className="grid gap-6 md:grid-cols-2">
				<BaseCard
					title="Pages at a glance"
					listItems={pageSummaries.map((section) => ({
						title: section.title,
						description: section.description,
					}))}
				/>
				<BaseCard
					title="How Match Entry guides captains"
					description="The busiest workflow lives on Match Entry. Here is how the page keeps things clear:"
					listItems={matchEntryHighlights.map((item) => ({
						description: item,
					}))}
					listVariant="bullet"
				/>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<BaseCard
					title="Tools under the hood"
					description="Lean choices that keep pages quick without adding extra steps for visitors:"
					listItems={dataPractices.map((tech) => ({
						title: tech.name,
						description: tech.description,
					}))}
					listColumns={1}
				/>

				<BaseCard
					title="How data stays smooth"
					description="The app keeps recent results close at hand and falls back gracefully when the network slows down:"
					listItems={cachingNotes.map((item) => ({
						description: item,
					}))}
					listVariant="bullet"
				/>
			</div>
		</PageShell>
	);
}

export default AboutPage;
