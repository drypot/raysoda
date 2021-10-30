import { newUser } from '@common/type/user'
import { UserDB } from '@server/db/user/user-db'

const hash1 = '$2a$10$bP0BJpAzAUNFZ2Ejo57Gruhg8LkIQ9./EvfUjjyYqwCf3ZDhQZC1K' /* 1234 */

export const USER1 = newUser({ id: 1, name: 'name1', home: 'home1', email: 'mail1@mail.test', hash: hash1,
  cdate: new Date(2003, 0, 17), adate: new Date(2003, 0, 17), pdate: new Date(2019, 0, 10) })
export const USER2 = newUser({ id: 2, name: 'name2', home: 'home2', email: 'mail2@mail.test', hash: hash1,
  cdate: new Date(2003, 1, 3), adate: new Date(2003, 1, 3), pdate: new Date(2019, 0, 20) })
export const USER3 = newUser({ id: 3, name: 'name3', home: 'home3', email: 'mail3@mail.test', hash: hash1,
  cdate: new Date(2003, 2, 1), adate: new Date(2003, 2, 1), pdate: new Date(2019, 0, 15) })
export const ADMIN = newUser({ id: 4, name: 'namea', home: 'homea', email: 'maila@mail.test', hash: hash1,
  cdate: new Date(2015, 9, 25), adate: new Date(2015, 9, 25), pdate: new Date(2019, 0, 5), admin: true })

export const USER1_LOGIN_FORM = { email: 'mail1@mail.test', password: '1234', remember: false }
export const USER2_LOGIN_FORM = { email: 'mail2@mail.test', password: '1234', remember: false }
export const USER3_LOGIN_FORM = { email: 'mail3@mail.test', password: '1234', remember: false }
export const ADMIN_LOGIN_FORM = { email: 'maila@mail.test', password: '1234', remember: false }

export async function userFixInsert1(udb: UserDB): Promise<void> {
  await udb.insertUser(USER1)
  udb.setNextId(2)
}

export async function userFixInsert4(udb: UserDB): Promise<void> {
  const users = [USER1, USER2, USER3, ADMIN]
  for (const user of users) {
    await udb.insertUser(user)
  }
  udb.setNextId(5)
}

