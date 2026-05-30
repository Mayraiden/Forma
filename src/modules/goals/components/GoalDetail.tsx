import { Card } from '@/shared/ui/Card'

import type { GoalWithLogs } from '../types'

type GoalDetailProps = {
	goal: GoalWithLogs
}

const pageStyles = 'space-y-4 py-2'
const titleStyles = 'text-2xl font-bold text-text-main'
const metaStyles = 'text-sm text-text-muted'

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

export function GoalDetail({ goal }: GoalDetailProps) {
	const checkIns = goal.goal_logs?.length ?? 0
	const durationLabel = formatDurationLabel(goal.duration_days)

	return (
		<div className={pageStyles}>
			<h1 className={titleStyles}>{goal.title}</h1>
			<Card className="h-auto space-y-2 bg-white">
				{goal.description && (
					<p className={metaStyles}>{goal.description}</p>
				)}
				<p className={metaStyles}>
					{statusLabels[goal.status] ?? goal.status}
					{durationLabel ? ` · ${durationLabel}` : ''}
				</p>
				<p className={metaStyles}>
					{goal.starts_at} — {goal.ends_at ?? '…'}
				</p>
				<p className={metaStyles}>
					{checkIns} {checkIns === 1 ? 'отметка' : 'отметок'}
				</p>
			</Card>
		</div>
	)
}
