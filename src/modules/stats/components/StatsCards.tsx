import {
	FireIcon,
	LightningIcon,
	TargetIcon,
	TrophyIcon,
} from '@phosphor-icons/react/dist/ssr'
import { cva, type VariantProps } from 'class-variance-authority'

import { getStreak } from '../statsService'

const iconStyles = cva(
	'flex h-10 w-10 items-center justify-center rounded-full',
	{
		variants: {
			tone: {
				orange: 'bg-accent-orange-soft text-accent-orange',
				green: 'bg-primary-soft text-primary',
				gold: 'bg-xp-gold-soft text-xp-gold',
				purple: 'bg-accent-purple-soft text-accent-purple',
			},
		},
	},
)

type StatCardProps = VariantProps<typeof iconStyles> & {
	icon: typeof FireIcon
	value: number
	label: string
}

function StatCard({ icon: IconCmp, value, label, tone }: StatCardProps) {
	return (
		<div className="flex flex-col items-center gap-2 rounded-2xl bg-bg-card p-4 shadow-card">
			<span className={iconStyles({ tone })}>
				<IconCmp size={20} weight="bold" />
			</span>
			<span className="text-xl font-bold text-text-main">{value}</span>
			<span className="text-xs uppercase text-text-muted">{label}</span>
		</div>
	)
}

export async function StatsCards() {
	const streak = await getStreak()

	return (
		<div className="grid grid-cols-4 gap-3">
			<StatCard icon={FireIcon} value={streak} label="Стрик" tone="orange" />
			{/* TODO: логика позже — пока заглушки */}
			<StatCard icon={TargetIcon} value={0} label="Готово" tone="green" />
			<StatCard icon={TrophyIcon} value={0} label="Рекорд" tone="gold" />
			<StatCard icon={LightningIcon} value={0} label="XP" tone="purple" />
		</div>
	)
}
