export default function GoalsLoading() {
	return (
		<div className="space-y-4 py-2 ">
			<h1 className="h-8 w-24 animate-pulse rounded-4xl bg-stroke" />
			<div className="flex flex-col gap-3">
				{[0, 1, 2].map((i) => (
					<div key={i} className="h-24 animate-pulse rounded-xl bg-stroke" />
				))}
			</div>
		</div>
	)
}
