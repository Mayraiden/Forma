import { Center, useGLTF } from '@react-three/drei'
import type { ThreeElements } from '@react-three/fiber'
import { avatarSceneConfig } from '@/core/config/canvas'

type AvatarModelProps = ThreeElements['group']

export function AvatarModel(props: AvatarModelProps) {
	const { scene } = useGLTF(avatarSceneConfig.modelPath)

	return (
		<group {...props} dispose={null}>
			<Center>
				<primitive object={scene} />
			</Center>
		</group>
	)
}

useGLTF.preload(avatarSceneConfig.modelPath)
