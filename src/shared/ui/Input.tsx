import type { InputHTMLAttributes } from 'react'
import { cn } from '@/core/lib/utils'

const inputStyles =
	'w-full h-12 p-2.5 text-base border border-stroke rounded-lg bg-transparent focus:outline-none text-md'

type InputProps = InputHTMLAttributes<HTMLInputElement>

export const Input = ({ type = 'text', className, ...props }: InputProps) => {
	return <input className={cn(inputStyles, className)} type={type} {...props} />
}
