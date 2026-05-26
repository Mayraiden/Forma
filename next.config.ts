import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	experimental: {
		// Без этого Turbopack в dev тянет тысячи иконок из barrel-экспорта
		optimizePackageImports: ['@phosphor-icons/react'],
	},
}

export default nextConfig
