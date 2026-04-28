type ICardPropsType = {
	className?: string
	title?: string
	subTitle?: string
	children: React.ReactNode
}

const cardStyles = 'w-full h-25 p-4 bg-card shadow-card rounded-xl'

export function Card({ className, children }: ICardPropsType) {
	return <div className={`${cardStyles} ${className}`}>{children}</div>
}
