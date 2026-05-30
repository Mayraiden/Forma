import { GoalList } from '@/modules/goals/components/GoalList'
import { getGoals } from '@/modules/goals/goalsService'

const pageStyles = 'space-y-4 py-2'
const titleStyles = 'text-2xl font-bold text-text-main'

export default async function GoalsPage() {
	// await new Promise((resolve) => setTimeout(resolve, 3000))
	const goals = await getGoals()

	return (
		<div className={pageStyles}>
			<h1 className={titleStyles}>Цели</h1>
			<GoalList goals={goals} />
		</div>
	)
}
