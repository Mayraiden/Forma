import { WelcomeCard } from '@/modules/dashboard/components/WelcomeCard'

const shellStyles = 'flex h-full w-full flex-col bg-bg-app'
const contentStyles =
	'grid h-full min-h-0 w-full grid-cols-1 grid-rows-[auto_minmax(0,1fr)] gap-4 xl:grid-cols-2'
const welcomeWrapStyles = 'xl:col-span-2'

export default function HomePage() {
	return (
		<main className={shellStyles}>
			<div className={contentStyles}>
				<div className={welcomeWrapStyles}>
					<WelcomeCard />
				</div>
			</div>
		</main>
	)
}
