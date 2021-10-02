import { loadConfigSync } from '../../_util/config-loader.js'
import { DB } from '../../db/_db/db.js'
import { UserDB } from '../../db/user/user-db.js'
import { insertUserFix4 } from '../../db/user/fixture/user-fix.js'
import { userRegisterService } from './user-register-service.js'
import { checkHash } from '../../_util/hash.js'
import {
  EMAIL_DUPE,
  EMAIL_RANGE,
  HOME_DUPE,
  HOME_RANGE,
  NAME_DUPE,
  NAME_RANGE,
  PASSWORD_RANGE
} from '../../_type/error-user.js'
import { Config } from '../../_type/config.js'
import { ErrorConst } from '../../_type/error.js'
import { newUserRegisterForm } from '../../_type/user-form.js'

describe('userRegisterService', () => {
  let config: Config
  let db: DB
  let udb: UserDB

  beforeAll(async () => {
    config = loadConfigSync('config/app-test.json')
    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
  })

  afterAll(async () => {
    await db.close()
  })

  it('init table', async () => {
    await udb.dropTable()
    await udb.createTable(false)
  })
  it('fill fix', async () => {
    await insertUserFix4(udb)
  })
  it('register user', async () => {
    const form = newUserRegisterForm({
      name: 'User X', email: 'userx@mail.test', password: '1234',
    })
    const err: ErrorConst[] = []
    const user = await userRegisterService(udb, form, err)
    if (!user) throw new Error()
    expect(user.name).toBe('User X')
    expect(user.home).toBe('User X')
    expect(user.email).toBe('userx@mail.test')
    expect(await checkHash('1234', user.hash)).toBe(true)
    expect(user.status).toBe('v')
    expect(user.admin).toBe(false)
  })
  it('check db', async () => {
    const user = await udb.findUserByHome('User X')
    if (!user) throw new Error()
    expect(user.name).toBe('User X')
    expect(user.home).toBe('User X')
    expect(user.email).toBe('userx@mail.test')
    expect(await checkHash('1234', user.hash)).toBe(true)
    expect(user.status).toBe('v')
    expect(user.admin).toBe(false)
  })
  it('format check works', async () => {
    const s33 = 'x'.repeat(33)
    const s65 = 'x'.repeat(66)
    const form = newUserRegisterForm({
      name: s33, email: s65, password: s33
    })
    const err: ErrorConst[] = []
    const user = await userRegisterService(udb, form, err)
    expect(err).toContain(NAME_RANGE)
    expect(err).toContain(HOME_RANGE)
    expect(err).toContain(EMAIL_RANGE)
    expect(err).toContain(PASSWORD_RANGE)
  })
  it('dupe check works', async () => {
    const form = newUserRegisterForm({
      name: 'User 2', email: 'user2@mail.test', password: '1234'
    })
    const err: ErrorConst[] = []
    const user = await userRegisterService(udb, form, err)
    expect(err).toContain(NAME_DUPE)
    expect(err).toContain(HOME_DUPE)
    expect(err).toContain(EMAIL_DUPE)
  })
})
