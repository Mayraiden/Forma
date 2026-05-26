'use client'

import { useCurrentTime } from '@/shared/hooks/useCurrentTime'
import { Card } from '@/shared/ui/Card'

const titleStyles = 'mb-2 pt-2 text-3xl font-bold'
const subTitleStyles =
	'flex items-center gap-2 font-bold text-primary tracking-widest'
const dotStyles = 'mt-0.5 h-2 w-2 rounded-full bg-primary'
const textStyles = 'text-sm font-medium tracking-tight'

export function WelcomeCard() {
	const { weekDay, time } = useCurrentTime()

	return (
		<Card className="h-32 bg-bg-card">
			<h4 className={subTitleStyles}>
				<div className={dotStyles} />
				<div className="flex items-center">
					<span className="mr-2">{weekDay}</span>
					<div className="mr-2 mt-1 h-1 w-1 rounded-full bg-primary" />
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
