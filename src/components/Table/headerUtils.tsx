import React from "react";
import HeaderLabel, { type HeaderLabelProps } from "./HeaderLabel";
import type { TableColumn } from "./types";

export const alignmentClassMap: Record<
	NonNullable<TableColumn<unknown>["align"]>,
	string
> = {
	left: "text-left",
	center: "text-center",
	right: "text-right",
};

export type ColumnAlignment = keyof typeof alignmentClassMap;

export const headerJustifyClassMap: Record<ColumnAlignment, string> = {
	left: "justify-start text-left",
	center: "justify-center text-center",
	right: "justify-end text-right",
};

export const headerPaddingClasses = "px-6 py-4";

const hasHeaderHintValue = (value?: string) =>
	typeof value === "string" && value.trim().length > 0;

const isHeaderLabelElement = (
	node: React.ReactNode
): node is React.ReactElement<HeaderLabelProps> =>
	React.isValidElement(node) && node.type === HeaderLabel;

export const headerNodeHasHint = (node: React.ReactNode) =>
	isHeaderLabelElement(node) && hasHeaderHintValue(node.props.hint);

export const columnHasHint = <T,>(column: TableColumn<T>) =>
	hasHeaderHintValue(column.headerHint) || headerNodeHasHint(column.header);

export const renderHeaderContent = (
	content: React.ReactNode,
	alignment: ColumnAlignment,
	hint?: string
) => {
	if (content === null || typeof content === "undefined") {
		return null;
	}

	if (typeof content === "string" || typeof content === "number") {
		return (
			<HeaderLabel
				label={String(content)}
				align={alignment}
				hint={hint}
			/>
		);
	}

	return content;
};
