import { User } from '../../_type/user.js'
import {
  checkEmailDupe,
  checkEmailFormat,
  checkHomeDupe,
  checkHomeFormat,
  checkNameDupe,
  checkNameFormat,
  checkPasswordFormat
} from './_user-service.js'
import { makeHash } from '../../_util/hash.js'
import { UserCache } from '../../db/user/cache/user-cache.js'
import { ErrorConst } from '../../_type/error.js'
import { UserUpdateForm } from '../../_type/user-form.js'
import { hasUpdatePerm } from '../../web/api/user-login/login-api.js'
import { NOT_AUTHORIZED } from '../../_type/error-user.js'


export async function userForUpdateService(uc: UserCache, id: number, form: UserUpdateForm, err: ErrorConst[]) {
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

export async function userUpdateService(uc: UserCache, user: User, id: number, form: UserUpdateForm, err: ErrorConst[]) {
  if (!hasUpdatePerm(user, id)) {
    err.push(NOT_AUTHORIZED)
    return
  }

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
  if (err.length > 0) {
    return
  }

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
