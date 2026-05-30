import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'

import { createClient } from '@/core/supabase/server'
import { GoalWidget } from '@/modules/goals/components/GoalWidget'
import { Header } from '@/shared/ui/Header'

type MainLayoutProps = {
	children: ReactNode
}

export default async function MainLayout({ children }: MainLayoutProps) {
	const supabase = await createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()
	if (!user) redirect('/login')

	return (
		<GoalWidget>
			<div className="flex h-full flex-col">
				<Header />
				<div className="flex min-h-0 flex-1 overflow-hidden">
					<main className="min-h-0 flex-1 overflow-auto px-2 pb-[calc(4rem+env(safe-area-inset-bottom))]">
						{children}
					</main>
				</div>
			</div>
		</GoalWidget>
	)
}
