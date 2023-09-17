import { ObjectId } from 'bson'
import { instanceof as _instanceof, string, ZodIssueCode } from 'zod'

export { array, boolean, date, number, object, string } from 'zod'

export const objectId = () => {
  return _instanceof(ObjectId).optional().or(
    string().transform((input, ctx) => {
      try {
        return ObjectId.createFromHexString(input)
      } catch (error) {
        ctx.addIssue({
          message: error instanceof Error ? error.message : 'unknown error',
          code: ZodIssueCode.custom,
          params: { input },
        })
      }
    }),
  )
}
