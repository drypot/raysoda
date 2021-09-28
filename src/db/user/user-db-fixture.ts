import { userOf } from '../../core/user.js'
import { UserDB } from './user-db.js'

const hash1 = '$2a$10$bP0BJpAzAUNFZ2Ejo57Gruhg8LkIQ9./EvfUjjyYqwCf3ZDhQZC1K' /* 1234 */

export async function insertUserFix1(udb: UserDB): Promise<void> {
  const users = [
    userOf({
      id: 1, name: 'User 1', home: 'user1', email: 'user1@mail.test', hash: hash1,
      pdate: new Date(2019, 0, 10)
    }),
  ]
  for (const user of users) {
    await udb.insertUser(user)
  }
  udb.setNextUserId(2)
}

export async function insertUserFix4(udb: UserDB): Promise<void> {
  const users = [
    userOf({
      id: 1, name: 'User 1', home: 'user1', email: 'user1@mail.test',
      hash: hash1, pdate: new Date(2019, 0, 10)
    }),
    userOf({
      id: 2, name: 'User 2', home: 'user2', email: 'user2@mail.test',
      hash: hash1, pdate: new Date(2019, 0, 20)
    }),
    userOf({
      id: 3, name: 'User 3', home: 'user3', email: 'user3@mail.test',
      hash: hash1, pdate: new Date(2019, 0, 15)
    }),
    userOf({
      id: 4, name: 'Admin', home: 'admin', email: 'admin@mail.test',
      hash: hash1, pdate: new Date(2019, 0, 5), admin: true
    })
  ]
  for (const user of users) {
    await udb.insertUser(user)
  }
  udb.setNextUserId(5)
}
