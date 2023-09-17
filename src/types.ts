import { ObjectId } from 'bson'
import {
  Filter as MongoDBFilter,
  UpdateFilter as MongoDBUpdateFilter,
} from 'mongodb'
import { infer as Infer, ZodIssue, ZodType } from 'zod'

export type Document = {
  _id: ObjectId
  createdAt: string
  updatedAt: string
}

export type Collection<T extends ZodType> =
  globalThis.Realm.Services.MongoDB.MongoDBCollection<Infer<T> & Document>

export type Database = ReturnType<globalThis.Realm.Services.MongoDB['db']>

export type ErrorListener = (
  event:
    | {
      type: 'ValidationError'
      issues: ZodIssue[]
      message: string
    }
    | {
      type: 'InitializationError'
      message: string
    },
) => unknown

export type Filter<T extends ZodType> = MongoDBFilter<
  Infer<T> & { createdAt: string; updatedAt: string }
>

export type UpdateFilter<T extends ZodType> = MongoDBUpdateFilter<
  Infer<T> & { createdAt: string; updatedAt: string }
>
