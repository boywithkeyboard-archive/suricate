import { Database, Filter, MongoDBCollection, UpdateFilter } from './types'

export class Collection<T extends Record<string, unknown>> {
  #db: () => Promise<Database>
  #name

  constructor(
    db: () => Promise<Database>,
    collectionName: string,
  ) {
    this.#db = db
    this.#name = collectionName
  }

  #col = async (): Promise<MongoDBCollection<T>> => {
    const db = await this.#db()

    return db.collection(this.#name)
  }

  aggregate = async (
    stages: Parameters<MongoDBCollection<T>['aggregate']>[0],
  ) => {
    return await (await this.#col()).aggregate(stages)
  }

  count = async (
    filter: Filter<T>,
    options?: Parameters<MongoDBCollection<T>['count']>[1],
  ) => {
    return await (await this.#col()).count(filter, options)
  }

  deleteOne = async (filter: Filter<T>) => {
    return await (await this.#col()).deleteOne(filter)
  }

  deleteMany = async (filter: Filter<T>) => {
    return await (await this.#col()).deleteMany(filter)
  }

  find = async (
    filter: Filter<T>,
    options?: Parameters<MongoDBCollection<T>['find']>[1],
  ) => {
    return await (await this.#col()).find(filter, options)
  }

  findOne = async (
    filter: Filter<T>,
    options?: Parameters<MongoDBCollection<T>['findOne']>[1],
  ) => {
    return await (await this.#col()).findOne(filter, options)
  }

  findOneAndUpdate = async (
    filter: Filter<T>,
    update: UpdateFilter<T>,
    options?: Parameters<MongoDBCollection<T>['findOneAndUpdate']>[2],
  ) => {
    const timestamp = new Date().toISOString()

    update = {
      ...update,
      updatedAt: timestamp,
    }

    return await (await this.#col()).findOneAndUpdate(filter, update, options)
  }

  findOneAndReplace = async (
    filter: Filter<T>,
    replacement: Omit<T, '_id' | 'createdAt' | 'updatedAt'>,
    options?: Parameters<MongoDBCollection<T>['findOneAndReplace']>[2],
  ) => {
    const timestamp = new Date().toISOString()

    replacement = {
      ...replacement,
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    return await (await this.#col()).findOneAndReplace(
      filter,
      replacement as Parameters<MongoDBCollection<T>['findOneAndReplace']>[1],
      options,
    )
  }

  findOneAndDelete = async (
    filter: Filter<T>,
    options?: Parameters<MongoDBCollection<T>['findOneAndDelete']>[1],
  ) => {
    return await (await this.#col()).findOneAndDelete(filter, options)
  }

  insertOne = async (
    document: Omit<T, '_id' | 'createdAt' | 'updatedAt'>,
  ) => {
    const timestamp = new Date().toISOString()

    document = {
      ...document,
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    return await (await this.#col()).insertOne(
      document as Parameters<MongoDBCollection<T>['insertOne']>[0],
    )
  }

  insertMany = async (
    ...documents: Omit<T, '_id' | 'createdAt' | 'updatedAt'>[]
  ) => {
    const timestamp = new Date().toISOString()

    documents = documents.map((document) => {
      return {
        ...document,
        createdAt: timestamp,
        updatedAt: timestamp,
      }
    })

    return await (await this.#col()).insertMany(
      documents as Parameters<MongoDBCollection<T>['insertMany']>[0],
    )
  }

  updateOne = async (
    filter: Filter<T>,
    update: UpdateFilter<T>,
    options?: Parameters<MongoDBCollection<T>['updateOne']>[2],
  ) => {
    const timestamp = new Date().toISOString()

    update = {
      ...update,
      updatedAt: timestamp,
    }

    return await (await this.#col()).updateOne(filter, update, options)
  }

  updateMany = async (
    filter: Filter<T>,
    update: UpdateFilter<T>,
    options?: Parameters<MongoDBCollection<T>['updateMany']>[2],
  ) => {
    const timestamp = new Date().toISOString()

    update = {
      ...update,
      updatedAt: timestamp,
    }

    return await (await this.#col()).updateMany(filter, update, options)
  }
}
