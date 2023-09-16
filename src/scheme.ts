import { Filter, UpdateFilter } from 'mongodb'
import { SuricateError } from './error'
import { Collection, Database } from './types'

export class Scheme<T extends Record<string, unknown>> {
  #col: () => Collection<T>

  constructor(
    getDatabase: () => Database | null,
    collectionName: string,
  ) {
    this.#col = () => {
      const db = getDatabase()

      if (db === null) {
        throw new SuricateError(
          'Please establish a connection to the database first!',
        )
      }

      return db.collection(collectionName)
    }
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
    const timestamp = new Date().toISOString()

    update = {
      ...update,
      updatedAt: timestamp,
    }

    return this.#col().findOneAndUpdate(filter, update, options)
  }

  findOneAndReplace = (
    filter: Filter<T>,
    replacement: Omit<T, '_id' | 'createdAt' | 'updatedAt'>,
    options?: Parameters<Collection<T>['findOneAndReplace']>[2],
  ) => {
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

  insertOne = (document: Omit<T, '_id' | 'createdAt' | 'updatedAt'>) => {
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

  insertMany = (...documents: Omit<T, '_id' | 'createdAt' | 'updatedAt'>[]) => {
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
    const timestamp = new Date().toISOString()

    update = {
      ...update,
      updatedAt: timestamp,
    }

    return this.#col().updateMany(filter, update, options)
  }
}
