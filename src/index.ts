import chalk from 'chalk'
import cliSelect from 'cli-select-2'
import { clear } from 'console'
import { writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { format } from 'prettier'
import { buildCss } from './buildCss.js'
import { generateColorSystem, RadixColorKey } from './generateColorSystem.js'
import path from 'path'

const brandScale: RadixColorKey[] = [
	'tomato',
	'red',
	'crimson',
	'pink',
	'plum',
	'purple',
	'violet',
	'indigo',
	'blue',
	'cyan',
	'teal',
	'green',
	'grass',
	'orange',
	'brown',
]
const grayScale: RadixColorKey[] = ['gray', 'mauve', 'slate', 'sage', 'olive', 'sand']
const naturalPairing: { gray: RadixColorKey; associated: RadixColorKey[] }[] = [
	{ gray: 'mauve', associated: ['tomato', 'red', 'crimson', 'pink', 'plum', 'purple', 'violet'] },
	{ gray: 'slate', associated: ['indigo', 'blue', 'cyan'] },
	{ gray: 'sage', associated: ['teal', 'green'] },
	{ gray: 'olive', associated: ['grass'] },
	{ gray: 'sand', associated: ['orange', 'brown'] },
]
const errorScale: RadixColorKey[] = ['red', 'tomato', 'crimson']
const successScale: RadixColorKey[] = ['teal', 'green', 'grass', 'mint']
const warningScale: RadixColorKey[] = ['yellow', 'amber']
const infoScale: RadixColorKey[] = ['blue', 'sky', 'cyan']

console.log(chalk.blue('select your brand scale'))
const brand = await cliSelect({ values: brandScale })
clear()
console.log(chalk.blue('select your gray scale'))
const pairingName = naturalPairing.find(el => el.associated.includes(brand.value))
const gray = await cliSelect<RadixColorKey>({ values: ['gray', pairingName?.gray ?? 'gray'] })
clear()
console.log(chalk.blue('select your error scale'))
const error = await cliSelect({ values: errorScale.filter(el => el !== brand.value) })
clear()
console.log(chalk.blue('select your success scale'))
const success = await cliSelect({ values: successScale.filter(el => el !== brand.value) })
clear()
console.log(chalk.blue('select your warning scale'))
const warning = await cliSelect({ values: warningScale.filter(el => el !== brand.value) })
clear()
console.log(chalk.blue('select your info scale'))
const info = await cliSelect({ values: infoScale.filter(el => el !== brand.value) })

const colorSystem = generateColorSystem(brand.value, gray.value, error.value, success.value, warning.value, info.value)

if (!existsSync('color-system')) await mkdir('color-system')
await writeFile(
	'color-system/color-system.js',
	format(
		`
const theme = 
${JSON.stringify(colorSystem)}`,
		{ parser: 'babel' }
	)
)
await writeFile('color-system/color-system.css', format(buildCss(colorSystem), { parser: 'css' }))
const pathToDirectory = path.join(process.cwd(), 'color-system')
console.log('the files are in ' + pathToDirectory)
