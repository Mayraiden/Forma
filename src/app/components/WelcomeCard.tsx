'use client'
import { Card } from '@/shared/ui/Card'
import { useCurrentTime } from '@/shared/hooks/useCurrentTime'

const titleStyles = 'mb-2 pt-2 text-3xl font-bold'
const subTitleStyles =
	'flex items-center gap-2 font-bold text-primary tracking-widest'
const doteStyles = 'h-2 w-2 mt-0.5 rounded full bg-primary'
const textStyles = 'text-sm traking-tight font-medium'

export function WelcomeCard() {
	const { weekDay, time } = useCurrentTime()

	return (
		<Card className="h-32 bg-radial-[at_top_right] from-accent-orange-soft to-transparent to-60%">
			<h4 className={subTitleStyles}>
				<div className={doteStyles}></div>
				<div className="flex items-center">
					<span className="mr-2">{weekDay}</span>
					<div className="w-1 h-1 mr-2 mt-1 rounded-full bg-primary"></div>
					<time>{time}</time>
				</div>
			</h4>
			<h2 className={titleStyles}>Добрый вечер, Виталий!</h2>
			<p className={textStyles}>
				Осталось <strong>3 задания</strong> до повышения уровня! Поддерживай
				серию - уже <strong>42 дня!</strong>
			</p>
		</Card>
	)
}
