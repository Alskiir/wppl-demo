import type { TeamRosterEntry } from "../types";
import { buildFullName, formatBirthday, formatRoleLabel } from "./rosterFormat";

type RosterRow = {
	player: string;
	role: string;
	email: string;
	phone: string;
	birthday: string;
};

const buildRows = (roster: TeamRosterEntry[]): RosterRow[] =>
	roster.map((entry) => ({
		player: buildFullName(entry),
		role: formatRoleLabel(entry.role),
		email: entry.person.email ?? "",
		phone: entry.person.phone_mobile ?? "",
		birthday: formatBirthday(entry.person.birthday),
	}));

const escapeCsvValue = (value: string) => {
	const needsQuotes = /[",\n]/.test(value);
	if (!needsQuotes) {
		return value;
	}
	return `"${value.replace(/"/g, '""')}"`;
};

const sanitizeFileName = (teamName: string | undefined, extension: string) => {
	const fallback = "team-roster";
	const normalized = teamName?.trim().toLowerCase() ?? fallback;
	const safe = normalized.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
	const finalName = safe || fallback;
	return `${finalName}.${extension}`;
};

const triggerDownload = (blob: Blob, filename: string) => {
	if (typeof document === "undefined") {
		return;
	}

	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = filename;
	anchor.style.display = "none";
	document.body.appendChild(anchor);
	anchor.click();
	document.body.removeChild(anchor);
	URL.revokeObjectURL(url);
};

const ensureLines = (lines: string[]) =>
	lines.length > 0 ? lines : ["No roster entries available."];

const createPdfDocument = (lines: string[]) => {
	const textEncoder = new TextEncoder();
	const safeLines = ensureLines(lines).map((line) =>
		line.replace(/([\\()])/g, "\\$1")
	);
	const contentLines = safeLines
		.map((line, index) =>
			index === 0 ? `(${line || " "}) Tj` : `T*\n(${line || " "}) Tj`
		)
		.join("\n");
	const streamContent = `BT\n/F1 12 Tf\n72 742 Td\n14 TL\n${contentLines}\nET`;
	const streamBytes = textEncoder.encode(streamContent);

	const objects = [
		"<< /Type /Catalog /Pages 2 0 R >>",
		"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
		"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
		`<< /Length ${streamBytes.length} >>\nstream\n${streamContent}\nendstream`,
		"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
	];

	const header = "%PDF-1.4\n";
	const headerBytes = textEncoder.encode(header).length;
	let currentOffset = headerBytes;
	const offsets: number[] = [];
	const objectStrings = objects
		.map((object, index) => {
			const serialized = `${index + 1} 0 obj\n${object}\nendobj\n`;
			offsets.push(currentOffset);
			currentOffset += textEncoder.encode(serialized).length;
			return serialized;
		})
		.join("");

	const xrefOffset = currentOffset;
	const xrefEntries = offsets
		.map((offset) => `${offset.toString().padStart(10, "0")} 00000 n \n`)
		.join("");
	const xref = `xref\n0 ${
		objects.length + 1
	}\n0000000000 65535 f \n${xrefEntries}`;
	const trailer = `trailer\n<< /Size ${
		objects.length + 1
	} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

	return `${header}${objectStrings}${xref}${trailer}`;
};

const downloadRosterCsv = (roster: TeamRosterEntry[], teamName?: string) => {
	const rows = buildRows(roster);
	const csvLines = [
		["Player", "Role", "Email", "Phone", "Birthday"],
		...rows.map((row) => [
			row.player,
			row.role,
			row.email,
			row.phone,
			row.birthday,
		]),
	];

	const csvContent = csvLines
		.map((line) => line.map((value) => escapeCsvValue(value)).join(","))
		.join("\r\n");
	const blob = new Blob([csvContent], {
		type: "text/csv;charset=utf-8;",
	});

	triggerDownload(blob, sanitizeFileName(teamName, "csv"));
};

const downloadRosterPdf = (roster: TeamRosterEntry[], teamName?: string) => {
	const rows = buildRows(roster);
	const lines = [
		`Team: ${teamName ?? "Unknown"}`,
		"",
		"Player | Role | Email | Phone | Birthday",
		...rows.map(
			(row) =>
				`${row.player} | ${row.role} | ${row.email || "-"} | ${
					row.phone || "-"
				} | ${row.birthday}`
		),
	];
	const pdfContent = createPdfDocument(lines);
	const blob = new Blob([pdfContent], { type: "application/pdf" });

	triggerDownload(blob, sanitizeFileName(teamName, "pdf"));
};

export { downloadRosterCsv, downloadRosterPdf };
