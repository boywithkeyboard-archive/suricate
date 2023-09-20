import { readFileSync, writeFileSync } from 'node:fs'

const content = readFileSync('./node_modules/bson/lib/bson.mjs', { encoding: 'utf-8' })

writeFileSync('./node_modules/bson/lib/bson.mjs', content.replace(`return (await import('crypto')).randomBytes`, `throw new Error()`))
