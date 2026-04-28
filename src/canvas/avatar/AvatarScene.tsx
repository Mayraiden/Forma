'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { avatarSceneConfig } from '@/core/config/canvas'
import { AvatarLights } from './AvatarLights'
import { AvatarModel } from './AvatarModel'

const canvasStyles = 'h-full w-full'

export function AvatarScene() {
	return (
		<Canvas
			className={canvasStyles}
			dpr={[1, 2]}
			camera={{ position: avatarSceneConfig.cameraPosition, fov: 35 }}
		>
			<Suspense fallback={null}>
				<AvatarLights />
				<AvatarModel
					position={avatarSceneConfig.modelPosition}
					rotation={avatarSceneConfig.modelRotation}
					scale={avatarSceneConfig.modelScale}
				/>
				<OrbitControls
					enablePan={false}
					enableZoom
					minDistance={avatarSceneConfig.minDistance}
					maxDistance={avatarSceneConfig.maxDistance}
					minPolarAngle={Math.PI / 2}
					maxPolarAngle={Math.PI / 2}
					target={avatarSceneConfig.controlsTarget}
				/>
			</Suspense>
		</Canvas>
	)
}
