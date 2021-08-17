import { USER_NOT_FOUND } from '../register-form/user-form.js'
import { FormError } from '../../../../lib/base/error2.js'
import { UserDB } from '../../db/user-db.js'

export async function userDeactivateService(udb: UserDB, id: number, errs: FormError[]) {
  const count = await udb.deactivateUser(id)
  if (!count) {
    errs.push(USER_NOT_FOUND)
    return
  }
  udb.deleteCacheById(id)
}