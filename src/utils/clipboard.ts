export const copyTextToClipboard = async (value: string) => {
	if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
		await navigator.clipboard.writeText(value);
		return;
	}

	if (typeof document === "undefined") {
		return;
	}

	const textarea = document.createElement("textarea");
	textarea.value = value;
	textarea.style.position = "fixed";
	textarea.style.top = "-9999px";
	document.body.appendChild(textarea);
	textarea.focus();
	textarea.select();
	document.execCommand("copy");
	document.body.removeChild(textarea);
};
