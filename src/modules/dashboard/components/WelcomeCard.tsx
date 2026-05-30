import { Card } from '@/shared/ui/Card'
import { CurrentTime } from '@/shared/ui/CurrentTime'

import { getUserData } from '../userDataService'
import { signOut } from '@/modules/auth/authService'

const titleStyles = 'mb-2 text-2xl font-bold'
const textStyles = 'text-sm font-medium tracking-tight'

export async function WelcomeCard() {
	const user = await getUserData()
	return (
		<Card className="h-32 p-2 bg-bg-card">
			<CurrentTime />
			<h2 className={titleStyles}>
				Добрый вечер, {user?.user_metadata?.display_name || 'Гость'}!
			</h2>
			<p className={textStyles}>
				Осталось <strong>3 задания</strong> до повышения уровня! Поддерживай
				серию - уже <strong>42 дня!</strong>
			</p>
		</Card>
	)
}
