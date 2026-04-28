import { AvatarScene } from '@/canvas/avatar/AvatarScene'
import { Card } from '@/shared/ui/Card'

const cardStyles =
	'relative h-full min-h-[360px] w-full overflow-hidden bg-[radial-gradient(ellipse_at_top_left,_rgba(34,197,94,0.2)_0%,_transparent_48%),radial-gradient(ellipse_at_top_right,_rgba(234,88,12,0.1)_0%,_transparent_42%),#fff]'
const sceneWrapStyles = 'absolute inset-0 h-full min-h-0'
const topInfoStyles =
	'pointer-events-none absolute left-5 top-5 z-10 flex flex-col gap-1'
const eyebrowStyles =
	'text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted'
const valueStyles = 'text-4xl font-bold leading-none tracking-tight text-primary'
const deltaStyles =
	'w-fit rounded-full bg-primary-soft px-2 py-0.5 text-xs font-bold text-primary'
const moodStyles =
	'pointer-events-none absolute right-5 top-5 z-10 flex flex-col items-end gap-1'
const moodBadgeStyles =
	'rounded-full border border-accent-orange/30 bg-accent-orange-soft px-2.5 py-1 text-lg'
const metricsStyles =
	'pointer-events-none absolute bottom-4 left-4 right-4 z-10 grid grid-cols-3 gap-2'
const metricStyles =
	'rounded-2xl border border-white/70 bg-white/70 px-3 py-2 shadow-[var(--shadow-card)] backdrop-blur-md'
const metricLabelStyles =
	'mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted'
const metricValueStyles = 'text-xl font-bold leading-none text-text-main'

const metrics = [
	{ label: 'Фокус', value: 92, color: 'bg-primary' },
	{ label: 'Энергия', value: 78, color: 'bg-accent-orange' },
	{ label: 'Восстановление', value: 84, color: 'bg-accent-purple' },
]

export function ProfileHeroCard() {
	return (
		<Card className={cardStyles}>
			<div className={topInfoStyles}>
				<span className={eyebrowStyles}>Жизненная форма</span>
				<strong className={valueStyles}>87.4</strong>
				<span className={deltaStyles}>↑ 2.1</span>
			</div>
			<div className={moodStyles}>
				<span className={eyebrowStyles}>Настрой</span>
				<span className={moodBadgeStyles} aria-label="Спокойный настрой">
					😌
				</span>
				<span className="text-xs font-semibold text-text-secondary">Собран</span>
			</div>
			<div className={sceneWrapStyles}>
				<AvatarScene />
			</div>
			<div className={metricsStyles}>
				{metrics.map((metric) => (
					<div key={metric.label} className={metricStyles}>
						<div className={metricLabelStyles}>
							<span className={`h-1.5 w-1.5 rounded-full ${metric.color}`} />
							<span>{metric.label}</span>
						</div>
						<strong className={metricValueStyles}>{metric.value}</strong>
					</div>
				))}
			</div>
		</Card>
	)
}
