import { Card } from '@/shared/ui/Card'
import { CurrentTime } from '@/shared/ui/CurrentTime'

import { getUserData } from '../userDataService'

const titleStyles = 'mb-2 text-2xl font-bold'
const textStyles = 'text-sm font-medium tracking-tight'

export async function WelcomeCard() {
	const user = await getUserData()
	return (
		<Card className="h-fit bg-bg-card">
			{/* <CurrentTime /> */}
			<h2 className={titleStyles}>
				Добрый вечер, {user?.user_metadata?.display_name || 'Гость'}!
			</h2>
		</Card>
	)
}
