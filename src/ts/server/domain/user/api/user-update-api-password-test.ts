import supertest, { SuperAgentTest } from 'supertest'
import { useUserUpdateApi } from '@server/domain/user/api/user-update-api'
import { ADMIN_LOGIN_FORM, insertUserFix4, USER1_LOGIN_FORM } from '@server/db/user/fixture/user-fix'
import { NOT_AUTHORIZED, PASSWORD_RANGE } from '@common/type/error-const'
import { checkHash } from '@common/util/hash'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'
import { useUserAuthApi } from '@server/domain/user/api/user-auth-api'
import { Express2 } from '@server/express/express2'
import { userLoginForTest } from '@server/domain/user/api/user-auth-api-fixture'
import { UserDB } from '@server/db/user/user-db'
import { UpdateUserPasswordForm } from '@common/type/user-form'
import { dupe } from '@common/util/object2'

describe('UserUpdateApi Update', () => {

  let udb: UserDB
  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    udb = await omanGetObject('UserDB') as UserDB
    web = await omanGetObject('Express2') as Express2
    await useUserAuthApi()
    await useUserUpdateApi()
    await web.start()
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  it('init table', async () => {
    await udb.dropTable()
    await udb.createTable()
  })
  it('fill fix', async () => {
    await insertUserFix4(udb)
  })

  // Update password

  it('login as user1', async () => {
    await userLoginForTest(sat, USER1_LOGIN_FORM)
  })
  it('check db before update', async () => {
    const user = await udb.getCachedById(1)
    if (!user) throw new Error()
    expect(dupe(user)).toEqual({
      id: 1, name: 'name1', home: 'home1', email: 'mail1@mail.test',
      hash: '$2a$10$bP0BJpAzAUNFZ2Ejo57Gruhg8LkIQ9./EvfUjjyYqwCf3ZDhQZC1K',
      status: 'v', admin: false,
      cdate: new Date(2003, 0, 17),
      adate: user.adate,
      pdate: new Date(2019, 0, 10),
      profile: ''
    })
  })
  it('update password', async () => {
    const form: UpdateUserPasswordForm = {
      id: 1, password: '5678'
    }
    const res = await sat.put('/api/user-update-password').send(form).expect(200)
    expect(res.body).toEqual({})
  })
  it('check db after update', async () => {
    const user = await udb.getCachedById(1)
    if (!user) throw new Error()
    expect(dupe(user)).toEqual({
      id: 1, name: 'name1', home: 'home1', email: 'mail1@mail.test',
      hash: user.hash,
      status: 'v', admin: false,
      cdate: new Date(2003, 0, 17),
      adate: user.adate,
      pdate: new Date(2019, 0, 10),
      profile: ''
    })
    expect(await checkHash('5678', user.hash)).toBe(true)
  })

  // Check range

  it('length 3 password fails', async () => {
    const form = { id: 1, password: 'xxx' }
    const res = await sat.put('/api/user-update-password').send(form).expect(200)
    expect(res.body.err).toContain(PASSWORD_RANGE)
  })
  it('length 4 password ok', async () => {
    const form = { id: 1, password: 'x'.repeat(4) }
    const res = await sat.put('/api/user-update-password').send(form).expect(200)
    expect(res.body.err).not.toContain(PASSWORD_RANGE)
  })
  it('length 32 password ok', async () => {
    const form = { id: 1, password: 'x'.repeat(32) }
    const res = await sat.put('/api/user-update-password').send(form).expect(200)
    expect(res.body.err).not.toContain(PASSWORD_RANGE)
  })
  it('length 33 password fails', async () => {
    const form = { id: 1, password: 'x'.repeat(33) }
    const res = await sat.put('/api/user-update-password').send(form).expect(200)
    expect(res.body.err).toContain(PASSWORD_RANGE)
  })

  // Check permission

  it('update user2 by user1 fails', async () => {
    const form = { id: 2, password: 'xxxx' }
    const res = await sat.put('/api/user-update-password').send(form).expect(200)
    expect(res.body.err).toContain(NOT_AUTHORIZED)
  })
  it('login as admin', async () => {
    await userLoginForTest(sat, ADMIN_LOGIN_FORM)
  })
  it('update user2 by admin works', async () => {
    const form = { id: 2, password: 'xxxx' }
    const res = await sat.put('/api/user-update-password').send(form).expect(200)
    expect(res.body).toEqual({})
  })

})
