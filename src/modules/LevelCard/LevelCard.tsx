import { Card } from '@/shared/ui/Card'
import { LevelBage } from '@/shared/ui/LevelBage'
import { ProgressBar } from '@/shared/ui/ProgressBar'

export const LevelCard = () => {
	return (
		<Card className="min-h-30 p-4 bg-bg-card flex flex-col gap-2">
			<div className="w-full h-full flex items-center gap-2">
				<LevelBage level="4" />
				<div className="flex flex-col">
					<div>Уровень 4</div>
					<div>20 / 100 xp</div>
				</div>
			</div>
			<ProgressBar value={20} />
		</Card>
	)
}
