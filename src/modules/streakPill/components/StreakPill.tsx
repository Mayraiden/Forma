import { FireIcon } from '@phosphor-icons/react'

type StreakPillProps = {
	value: number
}

export const StreakPill = ({ value }: StreakPillProps) => {
	return (
		<div className="w-20 h-9 p-1 flex items-center justify-center gap-2 bg-stroke/25 ring ring-accent-orange/10 rounded-4xl text-accent-orange shadow-card font-bold">
			<FireIcon size={30} weight="bold" className="" />
			<div className="text-xl">{value}</div>
		</div>
	)
}
