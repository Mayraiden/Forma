type LevelBageProps = {
	level?: string
}

export const LevelBage = ({ level }: LevelBageProps) => {
	return (
		<div className="w-15 h-15 flex items-center justify-center rounded-full bg-bg-app/20">
			<p className="text-xl font-bold text-bg-app">{level}</p>
		</div>
	)
}
