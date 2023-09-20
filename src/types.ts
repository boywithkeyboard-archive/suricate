import type { ObjectId } from 'bson'
import type {
  Filter as MongoDBFilter,
  UpdateFilter as MongoDBUpdateFilter,
} from 'mongodb'

export type Document = {
  _id: ObjectId
  createdAt: string
  updatedAt: string
}

export type MongoDBCollection<T extends Record<string, unknown>> =
  globalThis.Realm.Services.MongoDB.MongoDBCollection<T & Document>

export type Database = ReturnType<globalThis.Realm.Services.MongoDB['db']>

export type Filter<T extends Record<string, unknown>> = MongoDBFilter<
  T & { createdAt: string; updatedAt: string }
>

export type UpdateFilter<T extends Record<string, unknown>> =
  MongoDBUpdateFilter<
    T & { createdAt: string; updatedAt: string }
  >
