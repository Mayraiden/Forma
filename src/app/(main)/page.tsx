import { LevelCard } from '@/modules/LevelCard/LevelCard'
import { WeekStrip } from '@/modules/calendar/components/WeekStrip'
import { TodayHabits } from '@/modules/dashboard/components/TodayHabits'
import { StatsCards } from '@/modules/stats/components/StatsCards'

const shellStyles = 'pt-2 flex w-full flex-col xl:h-full'
const contentStyles =
	'grid w-full grid-cols-1 gap-4 xl:h-full xl:min-h-0 xl:grid-rows-[auto_minmax(0,1fr)] xl:grid-cols-2'
const welcomeWrapStyles = 'space-y-4 xl:col-span-2'

export default function HomePage() {
	return (
		<main className={shellStyles}>
			<div className={contentStyles}>
				<div className={welcomeWrapStyles}>
					<LevelCard />
					<WeekStrip />
					<StatsCards />
					<TodayHabits />
				</div>
			</div>
		</main>
	)
}
