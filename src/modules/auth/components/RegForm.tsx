'use client'

import { Field } from '@/shared/ui/Field'
import { Button } from '@/shared/ui/Button'
import { signUp } from '../authService'
import { useActionState } from 'react'

export const RegForm = () => {
	const [state, formAction, isPending] = useActionState(signUp, null)

	const containerStyles =
		'w-full max-w-md p-8 bg-bg-card rounded-xl space-y-6 shadow-lg ring-1 ring-stroke'

	const inputStyles =
		'p-2.5 border border-stroke rounded-lg bg-transparent focus:border-1 focus:border-accent-orange'

	const buttonStyles = 'w-full h-12 text-white bg-accent-orange'

	return (
		<div className={containerStyles}>
			{state?.error && <div>{state.error}</div>}
			<form action={formAction} className="space-y-4">
				<Field
					label="Ваше имя"
					name="displayName"
					type="text"
					id="text"
					placeholder="имя"
					required
					className={inputStyles}
				/>

				<Field
					label="email"
					name="email"
					type="email"
					id="email"
					placeholder="youremail@example.com"
				/>

				<Field
					label="Придумайте пароль"
					name="password"
					type="password"
					id="password"
				/>

				<Field
					label="Повторите пароль"
					name="password"
					type="password"
					id="password"
				/>
				<Button type="submit" className={buttonStyles}>
					{isPending ? 'Создаем' : 'Создать аккаунт'}
				</Button>
			</form>
		</div>
	)
}
