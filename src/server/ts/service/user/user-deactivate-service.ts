import { ErrorConst } from '@common/type/error'
import { User } from '@common/type/user'
import { checkUserUpdatable } from '@server/service/user/user-update-service'
import { UserDB } from '@server/db/user/user-db'

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
