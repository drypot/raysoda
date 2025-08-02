import { UserDB } from '../../../db/user/user-db.js'

export async function getUserList(udb: UserDB, p: number = 1, ps: number = 100) {
  let offset = (p - 1) * ps
  return await udb.getUserList(offset, ps)
}

export async function searchUser(
  udb: UserDB, q: string = '', p: number = 1, ps: number = 100, admin: boolean = false
) {
  let offset = (p - 1) * ps
  return await udb.searchUser(q, offset, ps, admin)
}
