import { newUser } from '../entity/user-entity.js'
import { DB } from '../../../lib/db/db.js'

export async function insertUserDBFixture(db: DB): Promise<void> {
  const objs = [
    newUser({ id: 1, name: 'Alice Liddell', home: 'alice', email: 'alice@mail.com' }),
  ]
  await db.insertObjects('user', objs)
}
