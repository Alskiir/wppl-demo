import { GlassCard, PageShell } from "../../components";

const siteSections = [
	{
		title: "All Tables Dashboard",
		description:
			"Presents every recorded match in one scrollable view so visitors can compare lines, scores, and divisions without jumping between tabs.",
	},
	{
		title: "Standings Tracker",
		description:
			"Calculates win-loss momentum per conference and division, highlighting the scenarios that influence playoff seeding.",
	},
	{
		title: "Team Directory",
		description:
			"Combines roster cards, player bios, and captain notes to show how each squad is constructed and where their strengths come from.",
	},
	{
		title: "Match Entry Workspace",
		description:
			"Streamlines captain workflows with PlayerSelect, LinesTable, and GameColumn components that validate lineups before publishing.",
	},
	{
		title: "Data Playground",
		description:
			"Results and teams data sets double as fixtures for prototypes and as seeds for future API integrations.",
	},
];

const technologyStack = [
	{
		name: "React + TypeScript + Vite",
		description:
			"Route-driven pages stay fast thanks to typed hooks, component composition, and Vite's instant dev feedback.",
	},
	{
		name: "Tailwind CSS + custom tokens",
		description:
			"Utility classes pair with GlassCard and PageShell primitives for a cohesive brand treatment on every screen size.",
	},
	{
		name: "Modular data layer",
		description:
			"Static TypeScript records mirror the schemas planned for league APIs, keeping mock and live data interchangeable.",
	},
	{
		name: "API-ready Node/Express services",
		description:
			"The project scaffolding anticipates secure endpoints for standings math, score validation, and push notifications.",
	},
];

const futureVision = [
	"Live scoring widgets that mirror Match Entry actions and update All Tables in real time.",
	"Self-serve analytics so captains can filter shot differentials, court surfaces, and player availability trends.",
	"In-app comms linking rosters, schedule adjustments, and broadcast notes directly to the Teams and Standings pages.",
	"Progressive Web App packaging for offline score entry and sideline-friendly push alerts.",
	"Open data exports that let tournament operators sync WPPL stats with national rankings.",
];

function AboutPage() {
	return (
		<PageShell
			title="WPPL Scoring System Overview"
			description="This page narrates how every screen in the Women's Power Pickleball League demo fits together and who each surface is built for."
			maxWidthClass="max-w-5xl"
			paddingClass="px-6 md:px-10"
		>
			<GlassCard description="The WPPL Scoring System is a single-page web experience where standings, results, rosters, and match entry tools share a common layout system. Navigation stays consistent whether someone is scanning the All Tables dashboard, diving into the Teams view, or logging a fresh match, making it easier to explain the entire site at a glance." />

			<div className="grid gap-6 md:grid-cols-2">
				<GlassCard
					title="Project Intent"
					description="This demo exists as a conversation piece with league directors. It demonstrates how data from results.ts, teams.ts, and future APIs can be surfaced through interactive tables, filterable cards, and controlled forms."
				/>

				<GlassCard
					title="Page-by-Page Tour"
					listItems={siteSections.map((section) => ({
						title: section.title,
						description: section.description,
					}))}
				/>
			</div>

			<GlassCard
				title="Technology Stack"
				description="Everything you see on the public demo is backed by a lightweight but production-minded toolkit:"
				listItems={technologyStack.map((tech) => ({
					title: tech.name,
					description: tech.description,
				}))}
				listColumns={2}
			/>

			<GlassCard
				title="Future Vision"
				description="The current experience explains what each page does today, and the following roadmap shows how it grows once live league data is connected:"
				listItems={futureVision.map((item) => ({
					description: item,
				}))}
				listColumns={2}
				footer="The site architecture already separates layout, data, and interaction layers so new modules can ship without redesigning the core experience."
			/>

			<GlassCard
				title="About the Developer"
				description="This demo was developed by Douglass Hart, a software developer passionate about combining technical precision with creative design. It serves as a showcase of his ability to unify interface design, database structure, and user experience into a cohesive web application."
			/>
		</PageShell>
	);
}

export default AboutPage;
