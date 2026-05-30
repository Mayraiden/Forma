'use client'

import { useCurrentTime } from '@/shared/hooks/useCurrentTime'

const subTitleStyles =
	'flex items-center gap-2 font-bold text-primary tracking-widest'
const dotStyles = 'mt-0.5 h-2 w-2 rounded-full bg-primary'

export const CurrentTime = () => {
	const { weekDay, time } = useCurrentTime()

	return (
		<h4 className={subTitleStyles}>
			<div className={dotStyles} />
			<div className="flex items-center">
				<span className="mr-2">{weekDay}</span>
				<div className="mr-2 mt-1 h-1 w-1 rounded-full bg-primary" />
				<time>{time}</time>
			</div>
		</h4>
	)
}
