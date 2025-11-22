type PlayerAvatarProps = {
	src: string;
	alt: string;
};

export const PlayerAvatar = ({ src, alt }: PlayerAvatarProps) => (
	<div className="h-32 w-32 overflow-hidden rounded-full border-4 border-(--surface-panel) bg-(--surface-panel) shadow-(--md-sys-elevation-1)">
		<img
			src={src}
			alt={alt}
			className="h-full w-full object-cover"
			loading="lazy"
		/>
	</div>
);
