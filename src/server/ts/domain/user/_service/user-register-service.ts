import { ErrorConst } from '@common/type/error'
import { UserRegisterForm } from '@common/type/user-form'
import {
  checkEmailDupe,
  checkEmailFormat,
  checkNameDupe,
  checkNameFormat,
  checkPasswordFormat
} from '@server/domain/user/_service/_user-service'
import { newUser } from '@common/type/user'
import { makeHash } from '@common/util/hash'
import { UserDB } from '@server/db/user/user-db'

export async function userRegisterService(udb: UserDB, form: UserRegisterForm, err: ErrorConst[]) {

  checkNameFormat(form.name, err)
  checkEmailFormat(form.email, err)
  checkPasswordFormat(form.password, err)

  await checkNameDupe(udb, 0, form.name, err)
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
