import * as Realm from 'realm-web'
import { ZodType } from 'zod'
import { Collection } from './collection'
import { SuricateError } from './error'
import { Database, ErrorListener } from './types'

export class Suricate {
  #db: Database | null
  #errorListener: ErrorListener

  constructor() {
    this.#db = null

    this.#errorListener = (data) => {
      throw new SuricateError(data.message)
    }
  }

  connect = async (options: {
    app: string
    token: string
    database: string
  }) => {
    if (this.#db !== null) {
      return
    }

    const app = new Realm.App(options.app),
      credentials = Realm.Credentials.apiKey(options.token),
      user = await app.logIn(credentials),
      client = user.mongoClient('mongodb-atlas')

    this.#db = client.db(options.database)
  }

  #getDatabase() {
    return this.#db
  }

  #getErrorListener() {
    return this.#errorListener
  }

  addErrorListener(
    func: ErrorListener,
  ) {
    this.#errorListener = func
  }

  collection = <T extends Record<string, ZodType>>(
    scheme: T,
    collectionName: string,
  ) => {
    return new Collection<T>(
      this.#getDatabase,
      this.#getErrorListener,
      scheme,
      collectionName,
    )
  }
}
