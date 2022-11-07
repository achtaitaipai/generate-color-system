export type colorSystem = {
	light: {
		[x: string]: string
	}
	dark: {
		[x: string]: string
	}
}

export const buildCss = ({ light, dark }: colorSystem) => {
	const lightStr = jsObjectToCss(light)
	const darkStr = jsObjectToCss(dark)
	return `:root{
        ${lightStr}
    }
    @media (prefers-color-scheme: dark) {
        :root {
        ${darkStr}
        }
    }
    [theme="light"]{
        ${lightStr}
    }
    [theme="dark"]{
      ${darkStr}
    }`
}

const jsObjectToCss = (obj: Record<string, string>) => {
	let str = ''
	for (const key in obj) {
		const value = obj[key].replace(/"/g, '')
		str += `--clr-${key}:${value};`
	}
	return str
}
