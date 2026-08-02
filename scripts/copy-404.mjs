import { copyFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const distDir = fileURLToPath(new URL('../dist', import.meta.url))

copyFileSync(`${distDir}/index.html`, `${distDir}/404.html`)
