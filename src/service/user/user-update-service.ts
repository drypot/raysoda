import { UserDB } from '../../db/user/user-db.js'
import { User } from '../../entity/user-entity.js'
import {
  checkEmailDB,
  checkEmailFormat,
  checkHomeDB,
  checkHomeFormat,
  checkNameDB,
  checkNameFormat,
  checkPasswordFormat,
  UserForm
} from './form/user-form.js'
import { FormError } from '../../lib/base/error2.js'
import { makeHash } from '../../lib/base/hash.js'

export async function userUpdateService(udb: UserDB, id: number, form: UserForm, errs: FormError[]) {
  checkNameFormat(form.name, errs)
  checkHomeFormat(form.home, errs)
  checkEmailFormat(form.email, errs)
  if (form.password) {
    checkPasswordFormat(form.password, errs)
  }
  await checkNameDB(udb, id, form.name, errs)
  await checkHomeDB(udb, id, form.home, errs)
  await checkEmailDB(udb, id, form.email, errs)
  if (errs.length > 0) return
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
