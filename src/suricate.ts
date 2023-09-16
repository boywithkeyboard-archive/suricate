import * as Realm from 'realm-web'
import { Scheme } from './scheme'
import { Database } from './types'

export class Suricate {
  #db: Database | null = null

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

  createScheme = <T extends Record<string, unknown>>(
    collectionName: string,
  ) => {
    return new Scheme<T>(this.#getDatabase, collectionName)
  }
}
