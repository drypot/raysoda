import { UserDB } from '../../db/user-db.js'

export async function userListService(udb: UserDB, p: number = 1, ps: number = 100) {
  let offset = (p - 1) * ps
  return await udb.listUser(offset, ps)
}

export async function userSearchService(
  udb: UserDB, q: string = '', p: number = 1, ps: number = 100, admin: boolean = false
) {
  let offset = (p - 1) * ps
  return await udb.searchUser(q, offset, ps, admin)
}
