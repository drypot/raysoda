import { UserCache } from '../../db/user/cache/user-cache.js'
import { ErrorConst } from '../../_type/error.js'
import { ACCOUNT_DEACTIVATED, EMAIL_NOT_FOUND, PASSWORD_WRONG } from '../../_type/error-user.js'
import { checkHash } from '../../_util/hash.js'

export async function loginService(uc: UserCache, email: string, password: string, err: ErrorConst[]) {
  const user = await uc.getCachedByEmailForce(email)
  if (!user) {
    err.push(EMAIL_NOT_FOUND)
    return
  }
  if (user.status === 'd') {
    err.push(ACCOUNT_DEACTIVATED)
    return
  }
  if (!await checkHash(password, user.hash)) {
    err.push(PASSWORD_WRONG)
    return
  }
  user.adate = new Date()
  await uc.udb.updateADate(user.id, user.adate)
  return user
}
