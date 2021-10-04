import { UserCache } from '../../db/user/cache/user-cache.js'
import { ErrorConst } from '../../_type/error.js'
import { User } from '../../_type/user.js'
import { checkUserUpdatable } from './user-update-service.js'

export async function userDeactivateService(uc: UserCache, user: User, id: number, err: ErrorConst[]) {
  const user2 = await checkUserUpdatable(uc, user, id, err)
  if (!user2 || err.length) {
    return
  }
  await uc.udb.updateStatus(id, 'd')
  uc.deleteCacheById(id)
}

export async function userActivateService(uc: UserCache, user: User, id: number, err: ErrorConst[]) {
  const user2 = await checkUserUpdatable(uc, user, id, err)
  if (!user2 || err.length) {
    return
  }
  await uc.udb.updateStatus(id, 'v')
  uc.deleteCacheById(id)
}
