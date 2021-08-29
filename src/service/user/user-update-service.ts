import { UserDB } from '../../db/user/user-db.js'
import { User } from '../../entity/user-entity.js'
import {
  checkEmailDupe,
  checkEmailFormat,
  checkHomeDupe,
  checkHomeFormat,
  checkNameDupe,
  checkNameFormat,
  checkPasswordFormat,
  UserUpdateForm
} from './form/user-form.js'
import { Error2 } from '../../lib/base/error2.js'
import { makeHash } from '../../lib/base/hash.js'

export async function userUpdateService(udb: UserDB, id: number, form: UserUpdateForm, err: Error2[]) {
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
  udb.deleteCacheById(id)
}
