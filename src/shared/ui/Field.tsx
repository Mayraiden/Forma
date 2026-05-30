import type { InputHTMLAttributes } from 'react'
import { Input } from './Input'

const labelStyles = 'text-sm font-medium text-text-main'

type FieldProps = {
	label: string
	id: string
} & InputHTMLAttributes<HTMLInputElement>

export const Field = ({ label, id, ...props }: FieldProps) => {
	return (
		<div className="flex flex-col gap-1">
			<label htmlFor={id} className={labelStyles}>
				{label}
			</label>
			<Input id={id} {...props} />
		</div>
	)
}
