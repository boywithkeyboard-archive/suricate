import { ObjectId } from 'bson'
import {
  array,
  boolean,
  date,
  instanceof as _instanceof,
  number,
  object,
  string,
  union,
  ZodIssueCode,
} from 'zod'

export const type = {
  string,
  number,
  boolean,
  array,
  object,
  union,
  date,
  objectId: () => {
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
  },
}
