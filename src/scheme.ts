import { SafeParseError, ZodType } from 'zod'
import { SuricateError } from './error'
import {
  Collection,
  Database,
  ErrorListener,
  Filter,
  Infer,
  UpdateFilter,
} from './types'

export class Scheme<T extends Record<string, ZodType>> {
  #col: () => Collection<T>
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

  #v(obj: Record<string, ZodType>) {
    const _obj: any = {}

    for (const key in obj) {
      const data = this.#scheme[key].safeParse(obj[key])

      if (data.success) {
        _obj[key] = data.data
      } else {
        this.#errorListener({
          type: 'ValidationError',
          message: (data as SafeParseError<any>).error.message,
          issues: (data as SafeParseError<any>).error.issues,
        })

        throw new SuricateError('Validation failed.')
      }
    }

    return _obj
  }

  count = (
    filter: Filter<T>,
    options?: Parameters<Collection<T>['count']>[1],
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
    options?: Parameters<Collection<T>['find']>[1],
  ) => {
    return this.#col().find(filter, options)
  }

  findOne = (
    filter: Filter<T>,
    options?: Parameters<Collection<T>['findOne']>[1],
  ) => {
    return this.#col().findOne(filter, options)
  }

  findOneAndUpdate = (
    filter: Filter<T>,
    update: UpdateFilter<T>,
    options?: Parameters<Collection<T>['findOneAndUpdate']>[2],
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
    options?: Parameters<Collection<T>['findOneAndReplace']>[2],
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
      replacement as Parameters<Collection<T>['findOneAndReplace']>[1],
      options,
    )
  }

  findOneAndDelete = (
    filter: Filter<T>,
    options?: Parameters<Collection<T>['findOneAndDelete']>[1],
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
      document as Parameters<Collection<T>['insertOne']>[0],
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
      documents as Parameters<Collection<T>['insertMany']>[0],
    )
  }

  updateOne = (
    filter: Filter<T>,
    update: UpdateFilter<T>,
    options?: Parameters<Collection<T>['updateOne']>[2],
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
    options?: Parameters<Collection<T>['updateMany']>[2],
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
