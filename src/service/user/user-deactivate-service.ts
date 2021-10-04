import { NOT_AUTHORIZED, USER_NOT_FOUND } from '../../_type/error-user.js'
import { UserCache } from '../../db/user/cache/user-cache.js'
import { ErrorConst } from '../../_type/error.js'
import { User, userIsAdmin } from '../../_type/user.js'
import { hasUpdatePerm } from '../../web/api/user-login/login-api.js'

export async function userDeactivateService(uc: UserCache, user: User, id: number, err: ErrorConst[]) {
  if (!hasUpdatePerm(user, id)) {
    err.push(NOT_AUTHORIZED)
    return
  }
  const count = await uc.udb.updateStatus(id, 'd')
  if (!count) {
    err.push(USER_NOT_FOUND)
    return
  }
  uc.deleteCacheById(id)
}

export async function userActivateService(uc: UserCache, user: User, id: number, err: ErrorConst[]) {
  if (!userIsAdmin(user)) {
    err.push(NOT_AUTHORIZED)
    return
  }
  const count = await uc.udb.updateStatus(id, 'v')
  if (!count) {
    err.push(USER_NOT_FOUND)
    return
  }
  uc.deleteCacheById(id)
}
