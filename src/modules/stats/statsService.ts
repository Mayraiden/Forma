'use server'

import { calcStreak } from '@/modules/calendar/CalendarModel'
import { createClient } from '@/core/supabase/server'

export async function getStreak(): Promise<number> {
	const supabase = await createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()
	if (!user) return 0

	const { data, error } = await supabase
		.from('goal_logs')
		.select('log_date')
		.eq('user_id', user.id)

	if (error || !data) return 0

	// log_date уже ISO 'yyyy-MM-dd' — тот же формат, что и toKey.
	const doneDates = new Set(data.map((row) => row.log_date))
	return calcStreak(doneDates, new Date())
}
