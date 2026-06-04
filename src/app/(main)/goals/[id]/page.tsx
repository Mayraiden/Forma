import { notFound } from 'next/navigation'
import { getGoalById } from '@/modules/goals/goalsService'
import { GoalDetail } from '@/modules/goals/components/GoalDetail'

type GoalPageProps = {
	params: Promise<{ id: string }>
}

export default async function GoalPage({ params }: GoalPageProps) {
	const { id } = await params
	const goal = await getGoalById(id)
	if (!goal) notFound()
	return <GoalDetail goal={goal} />
}
