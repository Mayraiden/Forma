'use server'

import { createClient } from '@/core/supabase/server'
import { revalidatePath } from 'next/cache'

import type {
	Goal,
	GoalActionState,
	GoalFormState,
	GoalWithLogs,
} from './types'

const AUTH_ERROR =
	'Проблемы с авторизацией. Попробуйте войти заново или попробуйте позже'

function getTodayInTimezone(timezone: string): string {
	return new Intl.DateTimeFormat('en-CA', {
		timeZone: timezone,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	}).format(new Date())
}

function parseDescription(value: FormDataEntryValue | null): string | null {
	if (typeof value !== 'string') return null
	const trimmed = value.trim()
	return trimmed || null
}

function parseDurationDays(value: FormDataEntryValue | null): number | null {
	if (typeof value !== 'string' || !value.trim()) return null
	const parsed = Number.parseInt(value, 10)
	if (!Number.isFinite(parsed) || parsed < 1) return null
	return parsed
}

function addDays(dateStr: string, days: number): string {
	const [year, month, day] = dateStr.split('-').map(Number)
	const date = new Date(Date.UTC(year, month - 1, day))
	date.setUTCDate(date.getUTCDate() + days)
	return date.toISOString().slice(0, 10)
}

function isDateInGoalRange(goal: Goal, date: string): boolean {
	if (date < goal.starts_at) return false
	if (goal.timing_type === 'fixed_range' && goal.ends_at && date > goal.ends_at) {
		return false
	}
	return true
}

async function getAuthenticatedUser() {
	const supabase = await createClient()
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser()

	if (error || !user) return { supabase, user: null }

	return { supabase, user }
}

async function maybeAutoCompleteGoal(supabase: Awaited<ReturnType<typeof createClient>>, goal: Goal) {
	if (
		goal.status !== 'active' ||
		goal.timing_type !== 'fixed_range' ||
		!goal.ends_at
	) {
		return goal
	}

	const today = getTodayInTimezone(goal.timezone)
	if (today <= goal.ends_at) return goal

	const { data, error } = await supabase
		.from('goals')
		.update({ status: 'completed' })
		.eq('id', goal.id)
		.select()
		.single()

	if (error || !data) return goal

	return data
}

export async function createGoal(
	_initialState: GoalFormState,
	formData: FormData,
): Promise<GoalFormState> {
	const { supabase, user } = await getAuthenticatedUser()
	if (!user) return { error: AUTH_ERROR }

	const titleRaw = formData.get('title')
	const title = typeof titleRaw === 'string' ? titleRaw.trim() : ''
	if (!title) return { error: 'Введите название цели' }

	const durationDays = parseDurationDays(formData.get('duration_days'))
	if (!durationDays) return { error: 'Укажите количество дней (минимум 1)' }

	const timezoneRaw = formData.get('timezone')
	const timezone =
		typeof timezoneRaw === 'string' && timezoneRaw.trim()
			? timezoneRaw.trim()
			: 'UTC'

	const startsAt = getTodayInTimezone(timezone)
	const endsAt = addDays(startsAt, durationDays - 1)
	const description = parseDescription(formData.get('description'))

	const { data: goal, error: goalError } = await supabase
		.from('goals')
		.insert({
			user_id: user.id,
			title,
			description,
			mode: 'solo',
			status: 'active',
			schedule_type: 'daily',
			timing_type: 'fixed_range',
			starts_at: startsAt,
			ends_at: endsAt,
			duration_days: durationDays,
			timezone,
		})
		.select('id')
		.single()

	if (goalError || !goal) {
		return { error: goalError?.message ?? 'Не удалось создать цель' }
	}

	const { error: memberError } = await supabase.from('goal_members').insert({
		goal_id: goal.id,
		user_id: user.id,
		role: 'owner',
		member_status: 'accepted',
	})

	if (memberError) {
		await supabase.from('goals').delete().eq('id', goal.id)
		return { error: memberError.message }
	}

	revalidatePath('/goals')
	return { success: true, goalId: goal.id }
}

export async function getGoals(): Promise<GoalWithLogs[]> {
	const { supabase, user } = await getAuthenticatedUser()
	if (!user) return []

	const { data, error } = await supabase
		.from('goals')
		.select('*, goal_logs(*)')
		.order('created_at', { ascending: false })

	if (error || !data) return []

	const completedGoals = await Promise.all(
		data.map((goal) => maybeAutoCompleteGoal(supabase, goal)),
	)

	return completedGoals
}

export async function getGoalById(id: string): Promise<GoalWithLogs | null> {
	const { supabase, user } = await getAuthenticatedUser()
	if (!user) return null

	const { data, error } = await supabase
		.from('goals')
		.select('*, goal_logs(*)')
		.eq('id', id)
		.single()

	if (error || !data) return null

	const goal = await maybeAutoCompleteGoal(supabase, data)
	return goal
}

export async function checkIn(goalId: string): Promise<GoalActionState> {
	const { supabase, user } = await getAuthenticatedUser()
	if (!user) return { error: AUTH_ERROR }

	const { data: goal, error: goalError } = await supabase
		.from('goals')
		.select('*')
		.eq('id', goalId)
		.single()

	if (goalError || !goal) return { error: 'Цель не найдена' }
	if (goal.status !== 'active') return { error: 'Цель уже завершена' }

	const today = getTodayInTimezone(goal.timezone)

	if (!isDateInGoalRange(goal, today)) {
		return { error: 'Сегодня нельзя отметиться в рамках этой цели' }
	}

	const { error } = await supabase.from('goal_logs').insert({
		goal_id: goalId,
		user_id: user.id,
		log_date: today,
		value: 1,
		completed_at: new Date().toISOString(),
	})

	if (error) {
		if (error.code === '23505') {
			return { error: 'Отметка за сегодня уже стоит' }
		}
		return { error: error.message }
	}

	revalidatePath('/')
	revalidatePath('/goals')
	revalidatePath(`/goals/${goalId}`)
	return { success: true }
}

export async function uncheckIn(goalId: string): Promise<GoalActionState> {
	const { supabase, user } = await getAuthenticatedUser()
	if (!user) return { error: AUTH_ERROR }

	const { data: goal, error: goalError } = await supabase
		.from('goals')
		.select('timezone, status')
		.eq('id', goalId)
		.single()

	if (goalError || !goal) return { error: 'Цель не найдена' }
	if (goal.status !== 'active') return { error: 'Цель уже завершена' }

	const today = getTodayInTimezone(goal.timezone)

	const { error } = await supabase
		.from('goal_logs')
		.delete()
		.eq('goal_id', goalId)
		.eq('user_id', user.id)
		.eq('log_date', today)

	if (error) return { error: error.message }

	revalidatePath('/goals')
	revalidatePath(`/goals/${goalId}`)
	return { success: true }
}

export async function toggleLog(
	goalId: string,
	date: string,
): Promise<GoalActionState> {
	const { supabase, user } = await getAuthenticatedUser()
	if (!user) return { error: AUTH_ERROR }

	const { data: goal, error: goalError } = await supabase
		.from('goals')
		.select('*')
		.eq('id', goalId)
		.single()

	if (goalError || !goal) return { error: 'Цель не найдена' }
	if (goal.status !== 'active') return { error: 'Цель уже завершена' }

	// Сервер — источник правды: дату с клиента не принимаем на веру.
	const today = getTodayInTimezone(goal.timezone)
	if (date > today) return { error: 'Нельзя отметить будущий день' }
	if (!isDateInGoalRange(goal, date)) {
		return { error: 'Этот день вне рамок цели' }
	}

	const { data: existing } = await supabase
		.from('goal_logs')
		.select('id')
		.eq('goal_id', goalId)
		.eq('user_id', user.id)
		.eq('log_date', date)
		.maybeSingle()

	if (existing) {
		const { error } = await supabase
			.from('goal_logs')
			.delete()
			.eq('id', existing.id)
		if (error) return { error: error.message }
	} else {
		const { error } = await supabase.from('goal_logs').insert({
			goal_id: goalId,
			user_id: user.id,
			log_date: date,
			value: 1,
			completed_at: new Date().toISOString(),
		})
		if (error) return { error: error.message }
	}

	revalidatePath('/')
	revalidatePath('/goals')
	revalidatePath(`/goals/${goalId}`)
	return { success: true }
}

export async function completeGoal(goalId: string): Promise<GoalActionState> {
	const { supabase, user } = await getAuthenticatedUser()
	if (!user) return { error: AUTH_ERROR }

	const { data: goal, error: goalError } = await supabase
		.from('goals')
		.select('timing_type, status')
		.eq('id', goalId)
		.single()

	if (goalError || !goal) return { error: 'Цель не найдена' }
	if (goal.timing_type !== 'manual') {
		return { error: 'Эту цель нельзя завершить вручную' }
	}
	if (goal.status !== 'active') return { error: 'Цель уже завершена' }

	const { error } = await supabase
		.from('goals')
		.update({ status: 'completed' })
		.eq('id', goalId)

	if (error) return { error: error.message }

	revalidatePath('/goals')
	revalidatePath(`/goals/${goalId}`)
	return { success: true }
}
