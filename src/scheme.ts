import { SafeParseError, ZodType } from 'zod'
import { ValidationError } from './error'
import {
  Database,
  Filter,
  Infer,
  MongoDBCollection,
  UpdateFilter,
} from './types'

export class Scheme<T extends Record<string, ZodType>> {
  #db: () => Promise<Database>
  #scheme: T
  #name

  constructor(
    db: () => Promise<Database>,
    scheme: T,
    collectionName: string,
  ) {
    this.#db = db
    this.#name = collectionName

    this.#scheme = scheme
  }

  #col = async (): Promise<MongoDBCollection<T>> => {
    const db = await this.#db()

    return db.collection(this.#name)
  }

  #v(d: Record<string, unknown>) {
    const res: any = {}

    for (const key in this.#scheme) {
      const data = this.#scheme[key].safeParse(d)

      if (data.success) {
        res[key] = data.data
      } else {
        // this.#errorListener({
        //   type: 'ValidationError',
        //   message: (data as SafeParseError<any>).error.message,
        //   issues: (data as SafeParseError<any>).error.issues,
        // })

        throw new ValidationError((data as SafeParseError<any>).error.message)
      }
    }

    return res
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
    update = this.#v(update)

    const timestamp = new Date().toISOString()

    update = {
      ...update,
      updatedAt: timestamp,
    }

    return await (await this.#col()).findOneAndUpdate(filter, update, options)
  }

  findOneAndReplace = async (
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
    document: Omit<Infer<T>, '_id' | 'createdAt' | 'updatedAt'>,
  ) => {
    document = this.#v(document)

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

    return await (await this.#col()).insertMany(
      documents as Parameters<MongoDBCollection<T>['insertMany']>[0],
    )
  }

  updateOne = async (
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

    return await (await this.#col()).updateOne(filter, update, options)
  }

  updateMany = async (
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

    return await (await this.#col()).updateMany(filter, update, options)
  }
}
