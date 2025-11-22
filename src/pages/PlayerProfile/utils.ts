export const formatSigned = (value: number, suffix = "") => {
	const rounded = Number(value.toFixed(2));
	const prefix = rounded > 0 ? "+" : "";
	return `${prefix}${rounded}${suffix}`;
};

export const isValidUuid = (value: string) =>
	/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
		value.trim()
	);
