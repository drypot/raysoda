import { User } from '../../_type/user.js'
import {
  checkEmailDupe,
  checkEmailFormat,
  checkHomeDupe,
  checkHomeFormat,
  checkNameDupe,
  checkNameFormat,
  checkPasswordFormat,
  UserUpdateForm
} from './_user-service.js'
import { makeHash } from '../../_util/hash.js'
import { UserCache } from '../../db/user/user-cache.js'
import { ErrorConst } from '../../_type/error.js'

export async function userUpdateService(uc: UserCache, id: number, form: UserUpdateForm, err: ErrorConst[]) {
  const udb = uc.udb
  checkNameFormat(form.name, err)
  checkHomeFormat(form.home, err)
  checkEmailFormat(form.email, err)
  if (form.password) {
    checkPasswordFormat(form.password, err)
  }
  await checkNameDupe(udb, id, form.name, err)
  await checkHomeDupe(udb, id, form.home, err)
  await checkEmailDupe(udb, id, form.email, err)
  if (err.length > 0) return
  let update: Partial<User> = {
    name: form.name,
    home: form.home,
    email: form.email,
    profile: form.profile
  }
  if (form.password.length) {
    update.hash = await makeHash(form.password)
  }
  await udb.updateUser(id, update)
  uc.deleteCacheById(id)
}
