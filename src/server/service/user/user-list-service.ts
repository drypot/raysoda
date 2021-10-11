import { UserDB } from '../../db/user/user-db'

export async function userListService(udb: UserDB, p: number = 1, ps: number = 100) {
  let offset = (p - 1) * ps
  return await udb.findUserList(offset, ps)
}
