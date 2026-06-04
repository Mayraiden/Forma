'use client'

import { GoogleLogoIcon } from '@phosphor-icons/react'
import { useActionState } from 'react'

import { signIn } from '../authService'
import { Button } from '@/shared/ui/Button'
import { Field } from '@/shared/ui/Field'
import { Divider } from '@/shared/ui/Divider'

const containerStyles =
	'w-full min-h-100 p-8 bg-bg-card ring-1 ring-stroke rounded-xl space-y-6 shadow-lg'
const inputStyles =
	'p-2.5 border border-stroke rounded-lg bg-transparent focus:border-1 focus:border-accent-orange'

const buttonStyles = 'w-full h-12 text-white bg-accent-orange'

export function LoginForm() {
	const [state, formAction, isPending] = useActionState(signIn, null)
	return (
		<div className={containerStyles}>
			<Button
				type="button"
				className="w-full gap-2 bg-white p-2.5 ring ring-stroke"
				onClick={() => {
					window.location.assign('/login/google')
				}}
			>
				<GoogleLogoIcon size={30} weight="regular" />
				Войти через Google
			</Button>

			<Divider />

			{state?.error && (
				<div className="p-3 text-sm bg-red-500/10 border border-red-500/20 text-red-400 rounded-md">
					{state.error}
				</div>
			)}

			<form action={formAction} className="space-y-4">
				<Field
					label="email"
					name="email"
					type="email"
					id="email"
					required
					className={inputStyles}
				/>

				<Field
					label="пароль"
					name="password"
					type="password"
					id="password"
					required
					className={inputStyles}
				/>

				<Button type="submit" className={buttonStyles} disabled={isPending}>
					{isPending ? 'Входим' : 'Войти'}
				</Button>
			</form>
		</div>
	)
}
