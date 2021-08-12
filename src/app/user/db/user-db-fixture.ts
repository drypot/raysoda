import { newUser, User } from '../entity/user-entity.js'
import { UserDB } from './user-db.js'

const hash1 = '$2a$10$bP0BJpAzAUNFZ2Ejo57Gruhg8LkIQ9./EvfUjjyYqwCf3ZDhQZC1K' /* 1234 */

export const UserFix1 = newUser({
  id: 1, name: 'User Name 1', home: 'user1', email: 'user1@mail.test', hash: hash1,
  pdate: new Date(2019, 0, 10)
})

export const UserFix2 = newUser({
    id: 2, name: 'User Name 2', home: 'user2', email: 'user2@mail.test', hash: hash1,
    pdate: new Date(2019, 0, 20)
  })

export const UserFix3 = newUser({
    id: 3, name: 'User Name 3', home: 'user3', email: 'user3@mail.test', hash: hash1,
    pdate: new Date(2019, 0, 15)
  })

export const UserFix4Admin = newUser({
    id: 4, name: 'Admin Name', home: 'admin', email: 'admin@mail.test', hash: hash1,
    pdate: new Date(2019, 0, 5), admin: true
  })


export async function insertUserDBFixture1(udb: UserDB): Promise<void> {
  const users = [ UserFix1 ]
  for (const user of users) {
    await udb.insertUser(user)
  }
  udb.setNextUserId(2)
}

export async function insertUserDBFixture4(udb: UserDB): Promise<void> {
  const users = [ UserFix1, UserFix2, UserFix3, UserFix4Admin ]
  for (const user of users) {
    await udb.insertUser(user)
  }
  udb.setNextUserId(5)
}
