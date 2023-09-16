import { ObjectId } from 'bson'

export type Document = {
  _id: ObjectId
  createdAt: string
  updatedAt: string
}

export type Collection<T extends Record<string, unknown>> =
  globalThis.Realm.Services.MongoDB.MongoDBCollection<T & Document>

export type Database = ReturnType<globalThis.Realm.Services.MongoDB['db']>
