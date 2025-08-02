import supertest from 'supertest'
import { getUserDB, UserDB } from '../../../db/user/user-db.js'
import { getPwMailDB, PwMailDB } from '../../../db/password/pwmail-db.js'
import { getMailer, Mailer } from '../../../mailer/mailer2.js'
import { Express2, getExpress2 } from '../../../express/express2.js'
import { closeAllObjects, initObjectContext } from '../../../oman/oman.js'
import { useUserAuthApi } from './user-auth-api.js'
import { useUserPasswordApi } from './user-password-api.js'
import { insertUserFix4, USER1 } from '../../../db/user/fixture/user-fix.js'
import {
  EMAIL_NOT_FOUND,
  EMAIL_PATTERN,
  INVALID_DATA,
  PASSWORD_RANGE,
  PASSWORD_RESET_TIMEOUT
} from '../../../common/type/error-const.js'
import { NewPasswordForm, PasswordMailLog } from '../../../common/type/password.js'
import { dateNull } from '../../../common/type/date-const.js'
import { checkHash } from '../../../common/util/hash.js'

describe('UserPwResetApi', () => {

  let udb: UserDB
  let rdb: PwMailDB
  let mailer: Mailer
  let express2: Express2
  let agent: supertest.Agent

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    udb = await getUserDB()
    rdb = await getPwMailDB()
    mailer = await getMailer()
    express2 = await getExpress2()
    await useUserAuthApi()
    await useUserPasswordApi()
    await express2.start()
    agent = supertest.agent(express2.server)
  })

  afterAll(async () => {
    await closeAllObjects()
  })

  it('init table', async () => {
    await udb.dropTable()
    await udb.createTable()
    await insertUserFix4(udb)
    await rdb.dropTable()
    await rdb.createTable()
  })
  it('send mail, email existence check', async () => {
    const res = await agent.post('/api/user-password-mail').send({ email: 'userx@mail.test' }).expect(200)
    expect(res.body.err).toContain(EMAIL_NOT_FOUND)
  })
  it('send mail, email format check', async () => {
    const res = await agent.post('/api/user-password-mail').send({ email: 'userx.mail.test' }).expect(200)
    expect(res.body.err).toContain(EMAIL_PATTERN)
  })
  it('send mail works', async () => {
    const res = await agent.post('/api/user-password-mail').send({ email: USER1.email }).expect(200)
    expect(res.body).toEqual({})
  })

  let rec: PasswordMailLog = { id: 0, email: '', random: '', cdate: dateNull }

  it('check db', async () => {
    const r = await rdb.getLogByEmail(USER1.email)
    if (!r) throw new Error()
    rec = r
  })
  it('set password, password format error', async () => {
    const form: NewPasswordForm = { id: rec.id, random: rec.random, password: '123' }
    const res = await agent.post('/api/user-password-reset').send(form).expect(200)
    expect(res.body.err).toContain(PASSWORD_RANGE)
  })
  it('set password, id error', async () => {
    const form: NewPasswordForm = { id: 999, random: rec.random,  password: '1234' }
    const res = await agent.post('/api/user-password-reset').send(form).expect(200)
    expect(res.body.err).toContain(INVALID_DATA)
  })
  it('set password, random error', async () => {
    const form: NewPasswordForm = { id: rec.id, random: 'xxx', password: '1234' }
    const res = await agent.post('/api/user-password-reset').send(form).expect(200)
    expect(res.body.err).toContain(INVALID_DATA)
  })
  it('set password works', async () => {
    const form: NewPasswordForm = { id: rec.id, random: rec.random, password: '5678' }
    const res = await agent.post('/api/user-password-reset').send(form).expect(200)
    expect(res.body).toEqual({})
  })
  it('check db', async () => {
    const user = await udb.getUserByEmail(USER1.email)
    if (!user) throw new Error()
    expect(await checkHash('5678', user.hash)).toBe(true)
  })
  it('insert timed out record', async () => {
    rec.cdate.setMinutes(rec.cdate.getMinutes() - 5)
    await rdb.insertLog(rec)
  })
  it('set password, timeout error', async () => {
    const form: NewPasswordForm = { id: rec.id, random: rec.random, password: '1234' }
    const res = await agent.post('/api/user-password-reset').send(form).expect(200)
    expect(res.body.err).toContain(PASSWORD_RESET_TIMEOUT)
  })

})
