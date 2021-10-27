import { UserDB } from '@server/db/user/user-db'

export async function userGetList(udb: UserDB, p: number = 1, ps: number = 100) {
  let offset = (p - 1) * ps
  return await udb.findUserList(offset, ps)
}

export async function userSearch(
  udb: UserDB, q: string = '', p: number = 1, ps: number = 100, admin: boolean = false
) {
  let offset = (p - 1) * ps
  return await udb.searchUser(q, offset, ps, admin)
}
