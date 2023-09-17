export { ObjectId } from 'https://esm.sh/bson@6.1.0?target=es2022'
export * from './field_types.ts'
export { Suricate } from './suricate.ts'
export type { Document } from './types.ts'

import { Suricate } from './suricate.ts'

const suricate = new Suricate()

export { suricate }
