import { SafeParseError, ZodType } from 'zod'
import { SuricateError } from './error'
import {
  Database,
  ErrorListener,
  Filter,
  Infer,
  MongoDBCollection,
  UpdateFilter,
} from './types'

export class Collection<T extends Record<string, ZodType>> {
  #col: () => MongoDBCollection<T>
  #scheme: T
  #getErrorListener: () => ErrorListener

  constructor(
    getDatabase: () => Database | null,
    getErrorListener: () => ErrorListener,
    scheme: T,
    collectionName: string,
  ) {
    this.#col = () => {
      const db = getDatabase()

      if (db === null) {
        this.#errorListener({
          type: 'InitializationError',
          message: 'Please establish a connection first!',
        })

        throw new SuricateError('Please establish a connection first!')
      }

      return db.collection(collectionName)
    }

    this.#getErrorListener = getErrorListener

    this.#scheme = scheme
  }

  get #errorListener() {
    return this.#getErrorListener()
  }

  #v(d: Record<string, unknown>) {
    const res: any = {}

    for (const key in this.#scheme) {
      const data = this.#scheme[key].safeParse(d)

      if (data.success) {
        res[key] = data.data
      } else {
        this.#errorListener({
          type: 'ValidationError',
          message: (data as SafeParseError<any>).error.message,
          issues: (data as SafeParseError<any>).error.issues,
        })

        throw new SuricateError('Validation failed.')
      }
    }

    return res
  }

  count = (
    filter: Filter<T>,
    options?: Parameters<MongoDBCollection<T>['count']>[1],
  ) => {
    return this.#col().count(filter, options)
  }

  deleteOne = (filter: Filter<T>) => {
    return this.#col().deleteOne(filter)
  }

  deleteMany = (filter: Filter<T>) => {
    return this.#col().deleteMany(filter)
  }

  find = (
    filter: Filter<T>,
    options?: Parameters<MongoDBCollection<T>['find']>[1],
  ) => {
    return this.#col().find(filter, options)
  }

  findOne = (
    filter: Filter<T>,
    options?: Parameters<MongoDBCollection<T>['findOne']>[1],
  ) => {
    return this.#col().findOne(filter, options)
  }

  findOneAndUpdate = (
    filter: Filter<T>,
    update: UpdateFilter<T>,
    options?: Parameters<MongoDBCollection<T>['findOneAndUpdate']>[2],
  ) => {
    update = this.#v(update)

    const timestamp = new Date().toISOString()

    update = {
      ...update,
      updatedAt: timestamp,
    }

    return this.#col().findOneAndUpdate(filter, update, options)
  }

  findOneAndReplace = (
    filter: Filter<T>,
    replacement: Omit<Infer<T>, '_id' | 'createdAt' | 'updatedAt'>,
    options?: Parameters<MongoDBCollection<T>['findOneAndReplace']>[2],
  ) => {
    replacement = this.#v(replacement)

    const timestamp = new Date().toISOString()

    replacement = {
      ...replacement,
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    return this.#col().findOneAndReplace(
      filter,
      replacement as Parameters<MongoDBCollection<T>['findOneAndReplace']>[1],
      options,
    )
  }

  findOneAndDelete = (
    filter: Filter<T>,
    options?: Parameters<MongoDBCollection<T>['findOneAndDelete']>[1],
  ) => {
    return this.#col().findOneAndDelete(filter, options)
  }

  insertOne = (document: Omit<Infer<T>, '_id' | 'createdAt' | 'updatedAt'>) => {
    document = this.#v(document)

    const timestamp = new Date().toISOString()

    document = {
      ...document,
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    return this.#col().insertOne(
      document as Parameters<MongoDBCollection<T>['insertOne']>[0],
    )
  }

  insertMany = (
    ...documents: Omit<Infer<T>, '_id' | 'createdAt' | 'updatedAt'>[]
  ) => {
    for (let document of documents) {
      document = this.#v(document)
    }

    const timestamp = new Date().toISOString()

    documents = documents.map((document) => {
      return {
        ...document,
        createdAt: timestamp,
        updatedAt: timestamp,
      }
    })

    return this.#col().insertMany(
      documents as Parameters<MongoDBCollection<T>['insertMany']>[0],
    )
  }

  updateOne = (
    filter: Filter<T>,
    update: UpdateFilter<T>,
    options?: Parameters<MongoDBCollection<T>['updateOne']>[2],
  ) => {
    update = this.#v(update)

    const timestamp = new Date().toISOString()

    update = {
      ...update,
      updatedAt: timestamp,
    }

    return this.#col().updateOne(filter, update, options)
  }

  updateMany = (
    filter: Filter<T>,
    update: UpdateFilter<T>,
    options?: Parameters<MongoDBCollection<T>['updateMany']>[2],
  ) => {
    update = this.#v(update)

    const timestamp = new Date().toISOString()

    update = {
      ...update,
      updatedAt: timestamp,
    }

    return this.#col().updateMany(filter, update, options)
  }
}
