import { newUser } from '../entity/user-entity.js'
import { UserDB } from './user-db.js'

export async function insertUserDBFixture(udb: UserDB): Promise<void> {
  const users = [
    newUser({ id: 1, name: 'Alice Liddell', home: 'alice', email: 'alice@mail.test' }),
  ]
  for (const user of users) {
    await udb.insertUser(user)
  }
  udb.setNextUserId(2)
}
