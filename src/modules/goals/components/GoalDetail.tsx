import type { GoalWithLogs } from '../types'
import { GoalProgress } from './GoalProgress'

type GoalDetailProps = {
	goal: GoalWithLogs
}

const pageStyles = 'space-y-4 py-2'

export function GoalDetail({ goal }: GoalDetailProps) {
	return (
		<div className={pageStyles}>
			<h2 className="text-xl">Календарь прогресса</h2>
			<GoalProgress goal={goal} />
		</div>
	)
}
