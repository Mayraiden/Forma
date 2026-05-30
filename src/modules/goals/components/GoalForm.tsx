'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/shared/ui/Button'
import { Field } from '@/shared/ui/Field'

import { createGoal } from '../goalsService'

type GoalFormProps = {
	onSuccess?: () => void
}

const formStyles = 'flex flex-col gap-4'
const errorStyles =
	'rounded-md border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400'

const goalButtonStyles = 'h-12 bg-accent-orange'

export function GoalForm({ onSuccess }: GoalFormProps) {
	const router = useRouter()
	const [state, action, isPending] = useActionState(createGoal, {})

	useEffect(() => {
		if (!state?.success) return
		router.refresh()
		onSuccess?.()
	}, [state?.success, onSuccess, router])

	return (
		<form action={action} className={formStyles}>
			<Field
				label="Назовите цель"
				type="text"
				name="title"
				id="title"
				required
			/>
			<Field
				label="На сколько дней"
				id="duration_days"
				name="duration_days"
				type="number"
				min={1}
				step={1}
				inputMode="numeric"
				placeholder="30"
				required
			/>
			<input
				type="hidden"
				name="timezone"
				value={Intl.DateTimeFormat().resolvedOptions().timeZone}
			/>
			{state?.error && <p className={errorStyles}>{state.error}</p>}
			<Button type="submit" disabled={isPending} className={goalButtonStyles}>
				{isPending ? 'Создаём…' : 'Создать'}
			</Button>
		</form>
	)
}
