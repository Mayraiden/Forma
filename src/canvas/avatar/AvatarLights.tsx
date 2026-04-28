export function AvatarLights() {
	return (
		<>
			<ambientLight intensity={1.7} />
			<directionalLight position={[3, 4, 3]} intensity={2.4} />
			<pointLight position={[-2, 1.5, 2]} intensity={1.2} color="#22c55e" />
		</>
	)
}
