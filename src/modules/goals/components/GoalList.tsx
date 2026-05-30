import { Card } from '@/shared/ui/Card'

import type { GoalWithLogs } from '../types'
import Link from 'next/link'

type GoalListProps = {
	goals: GoalWithLogs[]
}

const listStyles = 'flex flex-col gap-3'
const titleStyles = 'text-lg font-semibold text-text-main'
const metaStyles = 'text-sm text-text-muted font-bold'
const emptyStyles = 'text-sm text-text-muted'

const statusLabels: Record<string, string> = {
	active: 'Активна',
	completed: 'Завершена',
	archived: 'В архиве',
	failed: 'Провалена',
	pending: 'Ожидает',
	draft: 'Черновик',
}

function formatDurationLabel(days: number | null | undefined) {
	if (!days) return null
	const mod10 = days % 10
	const mod100 = days % 100
	if (mod10 === 1 && mod100 !== 11) return `${days} день`
	if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
		return `${days} дня`
	}
	return `${days} дней`
}

export function GoalList({ goals }: GoalListProps) {
	if (goals.length === 0) {
		return (
			<p className={emptyStyles}>
				Пока нет целей. Нажми + внизу, чтобы создать первую.
			</p>
		)
	}

	return (
		<ul className={listStyles}>
			{goals.map((goal) => {
				const checkIns = goal.goal_logs?.length ?? 0
				const durationLabel = formatDurationLabel(goal.duration_days)

				return (
					<li key={goal.id}>
						<Link href={`/goals/${goal.id}`}>
							<Card className="h-auto bg-white space-y-2">
								<h2 className={titleStyles}>{goal.title}</h2>
								{goal.description && (
									<p className={metaStyles}>{goal.description}</p>
								)}
								<p className={metaStyles}>
									{statusLabels[goal.status] ?? goal.status}
									{durationLabel ? ` · ${durationLabel}` : ''} · {checkIns}{' '}
									{checkIns === 1 ? 'отметка' : 'отметок'}
								</p>
							</Card>
						</Link>
					</li>
				)
			})}
		</ul>
	)
}
