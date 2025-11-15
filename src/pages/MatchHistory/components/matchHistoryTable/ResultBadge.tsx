import type { MatchResult } from "../../types";

const resultLabelMap: Record<MatchResult, string> = {
	win: "Win",
	loss: "Loss",
	tie: "Tie",
};

const resultToneMap: Record<MatchResult, string> = {
	win: "border-(--accent) text-(--accent) bg-(--surface-hover)",
	loss: "border-(--danger) text-(--danger) bg-(--surface-hover)",
	tie: "border-(--text-muted) text-(--text-muted) bg-(--surface-hover)",
};

type ResultBadgeProps = {
	result: MatchResult;
};

const ResultBadge = ({ result }: ResultBadgeProps) => (
	<span
		className={`rounded-full border px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wide ${resultToneMap[result]}`}
	>
		{resultLabelMap[result]}
	</span>
);

export default ResultBadge;
