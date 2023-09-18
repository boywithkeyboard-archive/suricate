import * as Realm from 'realm-web'
import { ZodType } from 'zod'
import { Collection } from './collection'
import { Database } from './types'

export class Suricate {
  #d: Database | null
  #options

  constructor(options: {
    app: string
    token: string
    database: string
  }) {
    this.#d = null
    this.#options = options
  }

  #db = async (): Promise<Database> => {
    if (this.#d !== null) {
      return this.#d
    }

    const app = new Realm.App(this.#options.app),
      credentials = Realm.Credentials.apiKey(this.#options.token),
      user = await app.logIn(credentials),
      client = user.mongoClient('mongodb-atlas')

    this.#d = client.db(this.#options.database)

    return this.#d
  }

  collection = <T extends Record<string, ZodType>>(
    collectionName: string,
  ) => {
    return new Collection<T>(
      this.#db,
      collectionName,
    )
  }
}
