import allColors from '@radix-ui/colors'
export type RadixColorKey = keyof typeof allColors

export function generateColorSystem(...args: RadixColorKey[]) {
	const values = ['brand', 'neutral', 'error', 'success', 'warning', 'info'] as const
	let lightColorSystem: Record<string, string> = {}
	args.forEach((el, i) => {
		lightColorSystem = { ...lightColorSystem, ...colorList(values[i], el) }
	})
	let darkColorSystem: Record<string, string> = {}
	args.forEach((el, i) => {
		darkColorSystem = { ...darkColorSystem, ...colorList(values[i], el) }
	})
	const colorSystem = { light: lightColorSystem, dark: darkColorSystem }
	return colorSystem
}

const colorList = (newName: string, oldName: RadixColorKey, isDark = false) => {
	const name = (oldName + (isDark ? 'Dark' : '')) as RadixColorKey
	const colors = allColors[name] as Record<string, string>
	const darkColors = allColors[oldName] as Record<string, string>
	const result: Record<string, string> = {}
	for (let i = 1; i <= 12; i++) {
		if (colors[oldName + i]) result[newName + i] = colors[oldName + i]
	}
	return result
}
