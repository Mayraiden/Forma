import { cn } from '@/core/lib/utils'

type ProgressBarProps = {
	value: number // 0–100
	className?: string
}

const trackStyles = 'h-2 w-full overflow-hidden rounded-full bg-stroke-light'
const fillStyles =
	'h-full rounded-full bg-primary transition-[width] duration-300'

export const ProgressBar = ({ value, className }: ProgressBarProps) => {
	const clamped = Math.min(100, Math.max(0, value))

	return (
		<div
			role="progressbar"
			aria-valuenow={clamped}
			aria-valuemin={0}
			aria-valuemax={100}
			className={cn(trackStyles, className)}
		>
			<div className={fillStyles} style={{ width: `${clamped}%` }} />
		</div>
	)
}
