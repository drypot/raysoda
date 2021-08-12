import { newUser, User } from '../entity/user-entity.js'
import { UserDB } from './user-db.js'

const hash1 = '$2a$10$bP0BJpAzAUNFZ2Ejo57Gruhg8LkIQ9./EvfUjjyYqwCf3ZDhQZC1K' /* 1234 */

const users1 = [
  newUser({ id: 1, name: 'User Name 1', home: 'user1', email: 'user1@mail.test', hash: hash1 }),
]

const users4 = [
  newUser({
    id: 1, name: 'User Name 1', home: 'user1', email: 'user1@mail.test', hash: hash1,
    pdate: new Date(2019, 0, 10)
  }),
  newUser({
    id: 2, name: 'User Name 2', home: 'user2', email: 'user2@mail.test', hash: hash1,
    pdate: new Date(2019, 0, 20)
  }),
  newUser({
    id: 3, name: 'User Name 3', home: 'user3', email: 'user3@mail.test', hash: hash1,
    pdate: new Date(2019, 0, 15)
  }),
  newUser({
    id: 4, name: 'Admin Name', home: 'admin', email: 'admin@mail.test', hash: hash1,
    pdate: new Date(2019, 0, 5), admin: true
  })
]

async function insertUserDBFixture(udb: UserDB, users: User[]): Promise<void> {
  for (const user of users) {
    await udb.insertUser(user)
  }
  udb.setNextUserId(users.length + 1)
}

export async function insertUserDBFixture1(udb: UserDB): Promise<void> {
  return insertUserDBFixture(udb, users1)
}

export async function insertUserDBFixture4(udb: UserDB): Promise<void> {
  return insertUserDBFixture(udb, users4)
}
