import { ErrorConst } from '@common/type/error'
import { UserRegisterForm } from '@common/type/user-form'
import {
  userCheckEmail,
  userCheckEmailDupe,
  userCheckName,
  userCheckNameDupe,
  userCheckPassword
} from '@server/domain/user/_service/_user-check'
import { newUser } from '@common/type/user'
import { makeHash } from '@common/util/hash'
import { UserDB } from '@server/db/user/user-db'

export async function userRegister(udb: UserDB, form: UserRegisterForm, err: ErrorConst[]) {

  userCheckName(form.name, err)
  userCheckEmail(form.email, err)
  userCheckPassword(form.password, err)

  await userCheckNameDupe(udb, 0, form.name, err)
  await userCheckEmailDupe(udb, 0, form.email, err)

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
