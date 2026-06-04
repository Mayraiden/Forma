import { getGoals } from '@/modules/goals/goalsService'

import { TodayHabitsList, type HabitItem } from './TodayHabitsList'

export async function TodayHabits() {
	const goals = await getGoals()

	const items: HabitItem[] = goals
		.filter((goal) => goal.status === 'active')
		.map((goal) => ({
			id: goal.id,
			title: goal.title,
			doneDates: goal.goal_logs?.map((log) => log.log_date) ?? [],
		}))

	return <TodayHabitsList items={items} />
}
