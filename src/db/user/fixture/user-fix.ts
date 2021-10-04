import { newUser } from '../../../_type/user.js'
import { UserDB } from '../user-db.js'

const hash1 = '$2a$10$bP0BJpAzAUNFZ2Ejo57Gruhg8LkIQ9./EvfUjjyYqwCf3ZDhQZC1K' /* 1234 */

// GUEST 는 테스트와 라이브 코드에 모두 사용된다.
export const GUEST = newUser({ id: -1, name: '', home: '', email: '', hash: '',
  cdate: new Date(2003, 0, 17), adate: new Date(2003, 0, 17), pdate: new Date(2003, 0, 17) })

export const USER1 = newUser({ id: 1, name: 'User 1', home: 'user1', email: 'user1@mail.test', hash: hash1,
  cdate: new Date(2003, 0, 17), adate: new Date(2003, 0, 17), pdate: new Date(2019, 0, 10) })
export const USER2 = newUser({ id: 2, name: 'User 2', home: 'user2', email: 'user2@mail.test', hash: hash1,
  cdate: new Date(2003, 1, 3), adate: new Date(2003, 1, 3), pdate: new Date(2019, 0, 20) })
export const USER3 = newUser({ id: 3, name: 'User 3', home: 'user3', email: 'user3@mail.test', hash: hash1,
  cdate: new Date(2003, 2, 1), adate: new Date(2003, 2, 1), pdate: new Date(2019, 0, 15) })
export const ADMIN = newUser({ id: 4, name: 'Admin', home: 'admin', email: 'admin@mail.test', hash: hash1,
  cdate: new Date(2015, 9, 25), adate: new Date(2015, 9, 25), pdate: new Date(2019, 0, 5), admin: true })

export const USER1_LOGIN = { email: 'user1@mail.test', password: '1234', remember: false }
export const USER2_LOGIN = { email: 'user2@mail.test', password: '1234', remember: false }
export const USER3_LOGIN = { email: 'user3@mail.test', password: '1234', remember: false }
export const ADMIN_LOGIN = { email: 'admin@mail.test', password: '1234', remember: false }

export async function insertUserFix1(udb: UserDB): Promise<void> {
  await udb.insertUser(USER1)
  udb.setNextId(2)
}

export async function insertUserFix4(udb: UserDB): Promise<void> {
  const users = [USER1, USER2, USER3, ADMIN]
  for (const user of users) {
    await udb.insertUser(user)
  }
  udb.setNextId(5)
}

