import { ErrorConst } from '@common/type/error'
import { UserRegisterForm } from '@common/type/user-form'
import { checkUserEmail, checkUserPassword } from '@server/domain/user/_service/_user-check'
import { newUser } from '@common/type/user'
import { makeHash } from '@common/util/hash'
import { UserDB } from '@server/db/user/user-db'
import { emailGetUserName } from '@common/util/email'
import { EMAIL_DUPE, HOME_RANGE, NAME_RANGE } from '@common/type/error-const'

export async function registerUser(udb: UserDB, form: UserRegisterForm, err: ErrorConst[]) {
  const { email, password } = form

  checkUserEmail(email, err)
  checkUserPassword(password, err)
  await checkEmailDupe(udb, email, err)
  if (err.length) return

  const baseName = emailGetUserName(email) as string
  const name = await getName(udb, baseName, err)
  const home = await getHome(udb, name, err)
  if (err.length) return

  const now = new Date()
  const user = newUser({
    id: udb.getNextId(),
    name,
    home,
    email,
    hash: await makeHash(password),
    profile: '',
    cdate: now,
    adate: now,
    pdate: new Date(2000, 0, 1)
  })
  await udb.insertUser(user)

  return user
}

async function checkEmailDupe(udb: UserDB, email: string, err: ErrorConst[]) {
  const user = await udb.getUserByEmail(email)
  if (user) err.push(EMAIL_DUPE)
}

async function getName(udb: UserDB, name: string, err: ErrorConst[]) {
  while (name.length < 33) {
    const user = await udb.getUserByName(name)
    if (!user) return name
    name += getRandomDigit()
  }
  err.push(NAME_RANGE)
  return name
}

async function getHome(udb: UserDB, home: string, err: ErrorConst[]) {
  while (home.length < 33) {
    const user = await udb.getUserByHome(home)
    if (!user) return home
    home += getRandomDigit()
  }
  err.push(HOME_RANGE)
  return home
}

function getRandomDigit() {
  return String(Math.floor(Math.random() * 10))
}
