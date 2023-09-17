export { ObjectId } from 'bson'
export { z as type } from 'zod'
export { Suricate } from './suricate'
export { Document } from './types'

import { Suricate } from './suricate'

const suricate = new Suricate()

export default suricate
