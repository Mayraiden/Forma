import { signOut } from '@/modules/auth/authService'
import { Button } from '@/shared/ui/Button'

import { SignOutIcon } from '@phosphor-icons/react/ssr'

const buttonSignOutStyles = 'h-10 p-2 text-lg text-white bg-red-600 rounded-xl'

export default function Settings() {
	return (
		<main className="h-full flex flex-col gap-2">
			<div className="h-full p-2 flex flex-col">
				<form action={signOut} className="mt-auto">
					<Button type="submit" className={buttonSignOutStyles}>
						Выйти из аккаунта
						<SignOutIcon
							size={25}
							weight="regular"
							className="shrink-0"
							color="currentColor"
						/>
					</Button>
				</form>
			</div>
		</main>
	)
}
