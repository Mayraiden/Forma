import { LevelCard } from '@/modules/LevelCard/LevelCard'
import { WelcomeCard } from '@/modules/dashboard/components/WelcomeCard'

const shellStyles = 'flex h-full w-full flex-col'
const contentStyles =
	'grid h-full min-h-0 w-full grid-cols-1 grid-rows-[auto_minmax(0,1fr)] gap-4 xl:grid-cols-2'
const welcomeWrapStyles = 'space-y-4 xl:col-span-2'

export default function HomePage() {
	return (
		<main className={shellStyles}>
			<div className={contentStyles}>
				<div className={welcomeWrapStyles}>
					{/* <WelcomeCard /> */}
					<LevelCard />
				</div>
			</div>
		</main>
	)
}
