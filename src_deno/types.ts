import { ObjectId } from 'https://esm.sh/bson@6.1.0?target=es2022'
import {
  Filter as MongoDBFilter,
  UpdateFilter as MongoDBUpdateFilter,
} from 'https://esm.sh/mongodb@6.1.0?target=es2022'
import {
  infer as ZodInfer,
  ZodIssue,
  ZodObject,
  ZodType,
} from 'https://deno.land/x/zod@v3.22.2/mod.ts'

export type Document = {
  _id: ObjectId
  createdAt: string
  updatedAt: string
}

export type Infer<T extends Record<string, ZodType>> = ZodInfer<ZodObject<T>>

export type MongoDBCollection<T extends Record<string, ZodType>> =
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

export type Filter<T extends Record<string, ZodType>> = MongoDBFilter<
  Infer<T> & { createdAt: string; updatedAt: string }
>

export type UpdateFilter<T extends Record<string, ZodType>> =
  MongoDBUpdateFilter<
    Infer<T> & { createdAt: string; updatedAt: string }
  >
