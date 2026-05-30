import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/core/lib/utils'

const baseStyles =
	'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-opacity focus-visible:outline-none focus-visible:ring focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60 select-none'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export const Button = ({
	className,
	children,
	type = 'button',
	...props
}: ButtonProps) => {
	return (
		<button className={cn(baseStyles, className)} type={type} {...props}>
			{children}
		</button>
	)
}
