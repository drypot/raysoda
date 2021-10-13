import { ErrorConst } from '../../_type/error'
import { User } from '../../_type/user'
import { checkUserUpdatable } from './user-update-service'
import { UserDB } from '../../db/user/user-db'

export async function userDeactivateService(udb: UserDB, user: User, id: number, err: ErrorConst[]) {
  const user2 = await udb.getCachedById(id)
  await checkUserUpdatable(udb, user, user2, err)
  if (!user2 || err.length) {
    return
  }
  await udb.updateStatus(id, 'd')
}

export async function userActivateService(udb: UserDB, user: User, id: number, err: ErrorConst[]) {
  const user2 = await udb.getCachedById(id)
  await checkUserUpdatable(udb, user, user2, err)
  if (!user2 || err.length) {
    return
  }
  await udb.updateStatus(id, 'v')
}
