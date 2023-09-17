import { ObjectId } from 'bson'
import { z, ZodIssue, ZodType } from 'zod'
import {
  Filter as MongoDBFilter,
  UpdateFilter as MongoDBUpdateFilter,
} from 'mongodb'

export type Document = {
  _id: ObjectId
  createdAt: string
  updatedAt: string
}

export type Collection<T extends Record<string, ZodType>> =
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

export type Infer<T extends Record<string, ZodType>> = z.infer<
  ReturnType<typeof z.object<T>>
>

export type Filter<T extends Record<string, ZodType>> = MongoDBFilter<
  Infer<T> & { createdAt: string; updatedAt: string }
>

export type UpdateFilter<T extends Record<string, ZodType>> =
  MongoDBUpdateFilter<Infer<T> & { createdAt: string; updatedAt: string }>
