import {
  checkEmailDupe,
  checkEmailFormat,
  checkHomeDupe,
  checkHomeFormat,
  checkNameDupe,
  checkNameFormat,
  checkPasswordFormat
} from './_user-service'
import { newUser } from '../../_type/user'
import { UserDB } from '../../db/user/user-db'
import { makeHash } from '../../_util/hash'
import { ErrorConst } from '../../_type/error'
import { UserRegisterForm } from '../../_type/user-form'

export async function userRegisterService(udb: UserDB, form: UserRegisterForm, err: ErrorConst[]) {
  checkNameFormat(form.name, err)
  checkHomeFormat(form.name, err)
  checkEmailFormat(form.email, err)
  checkPasswordFormat(form.password, err)
  await checkNameDupe(udb, 0, form.name, err)
  await checkHomeDupe(udb, 0, form.name, err)
  await checkEmailDupe(udb, 0, form.email, err)
  if (err.length) return
  const now = new Date()
  const user = newUser({
    id: udb.getNextId(),
    name: form.name,
    home: form.name,
    email: form.email,
    hash: await makeHash(form.password),
    profile: '',
    cdate: now,
    adate: now,
    pdate: new Date(2000, 0, 1)
  })
  await udb.insertUser(user)
  return user
}
