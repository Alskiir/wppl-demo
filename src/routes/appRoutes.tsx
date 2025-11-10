import type { ComponentType, ReactElement } from "react";
import {
	AboutPage,
	HomePage,
	MatchEntryPage,
	StandingsPage,
	TeamsPage,
} from "../pages";

type RouteMeta = {
	component: ComponentType;
	label: string;
	showInNav?: boolean;
	path?: string;
	navPath?: string;
	index?: boolean;
};

const defineRoutes = <T extends Record<string, RouteMeta>>(routes: T) => routes;

const routeMeta = defineRoutes({
	home: {
		component: HomePage,
		label: "Home",
		index: true,
	},
	standings: {
		component: StandingsPage,
		label: "Standings",
	},
	teams: {
		component: TeamsPage,
		label: "Teams",
	},
	"match-entry": {
		component: MatchEntryPage,
		label: "Match Entry",
	},
	about: {
		component: AboutPage,
		label: "About",
	},
});

type RouteKey = keyof typeof routeMeta;

export type AppRouteConfig = {
	key: string;
	path: string;
	element: ReactElement;
	label: string;
	showInNav?: boolean;
	navPath?: string;
	index?: boolean;
};

export type NavRoute = {
	key: string;
	label: string;
	path: string;
};

const normalizeNavPath = (path: string) =>
	path.startsWith("/") ? path : `/${path}`;

export const appRoutes: AppRouteConfig[] = (
	Object.entries(routeMeta) as Array<[RouteKey, RouteMeta]>
).map(([key, meta]) => {
	const path = meta.path ?? key;
	const Component = meta.component;

	return {
		key,
		path,
		element: <Component />,
		label: meta.label,
		showInNav: meta.showInNav ?? true,
		navPath: meta.navPath,
		index: meta.index ?? false,
	};
});

export const navRoutes: NavRoute[] = appRoutes
	.filter(({ showInNav }) => showInNav)
	.map(({ key, label, navPath, path }) => ({
		key,
		label,
		path: normalizeNavPath(navPath ?? path),
	}));
