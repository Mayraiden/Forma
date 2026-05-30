import type { Tables } from '@/core/supabase/database.types'

export type Goal = Tables<'goals'>
export type GoalLog = Tables<'goal_logs'>
export type GoalMember = Tables<'goal_members'>

export type GoalMode = 'solo' | 'coop' | 'competitive'
export type GoalTimingType = 'fixed_range' | 'open_ended' | 'manual'
export type GoalStatus =
	| 'draft'
	| 'pending'
	| 'active'
	| 'completed'
	| 'failed'
	| 'archived'

export type GoalMemberRole = 'owner' | 'member'
export type GoalMemberStatus =
	| 'invited'
	| 'accepted'
	| 'declined'
	| 'quit'
	| 'eliminated'

export type GoalWithLogs = Goal & {
	goal_logs: GoalLog[]
}

export type GoalFormState = {
	error?: string
	success?: boolean
	goalId?: string
}

export type GoalActionState = {
	error?: string
	success?: boolean
}
