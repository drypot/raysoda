import { getUserDB, UserDB } from '../../../db/user/user-db.ts'
import { Express2, getExpress2 } from '../../../express/express2.ts'
import supertest from 'supertest'
import { closeAllObjects, initObjectContext } from '../../../oman/oman.ts'
import { useUserAuthApi } from './user-auth-api.ts'
import { useUserUpdateApi } from './user-update-api.ts'
import { ADMIN_LOGIN_FORM, insertUserFix4, USER1_LOGIN_FORM } from '../../../db/user/fixture/user-fix.ts'
import { userLoginForTest } from './user-auth-api-fixture.ts'
import { dupe } from '../../../common/util/object2.ts'
import type { UpdateUserPasswordForm } from '../../../common/type/user-form.ts'
import { checkHash } from '../../../common/util/hash.ts'
import { NOT_AUTHORIZED, PASSWORD_RANGE } from '../../../common/type/error-const.ts'

describe('UserUpdateApi Update', () => {

  let udb: UserDB
  let express2: Express2
  let agent: supertest.Agent

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    udb = await getUserDB()
    express2 = await getExpress2()
    await useUserAuthApi()
    await useUserUpdateApi()
    await express2.start()
    agent = supertest.agent(express2.server)
  })

  afterAll(async () => {
    await closeAllObjects()
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
    await userLoginForTest(agent, USER1_LOGIN_FORM)
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
    const res = await agent.put('/api/user-update-password').send(form).expect(200)
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
    const res = await agent.put('/api/user-update-password').send(form).expect(200)
    expect(res.body.err).toContain(PASSWORD_RANGE)
  })
  it('length 4 password ok', async () => {
    const form = { id: 1, password: 'x'.repeat(4) }
    const res = await agent.put('/api/user-update-password').send(form).expect(200)
    expect(res.body.err).not.toContain(PASSWORD_RANGE)
  })
  it('length 32 password ok', async () => {
    const form = { id: 1, password: 'x'.repeat(32) }
    const res = await agent.put('/api/user-update-password').send(form).expect(200)
    expect(res.body.err).not.toContain(PASSWORD_RANGE)
  })
  it('length 33 password fails', async () => {
    const form = { id: 1, password: 'x'.repeat(33) }
    const res = await agent.put('/api/user-update-password').send(form).expect(200)
    expect(res.body.err).toContain(PASSWORD_RANGE)
  })

  // Check permission

  it('update user2 by user1 fails', async () => {
    const form = { id: 2, password: 'xxxx' }
    const res = await agent.put('/api/user-update-password').send(form).expect(200)
    expect(res.body.err).toContain(NOT_AUTHORIZED)
  })
  it('login as admin', async () => {
    await userLoginForTest(agent, ADMIN_LOGIN_FORM)
  })
  it('update user2 by admin works', async () => {
    const form = { id: 2, password: 'xxxx' }
    const res = await agent.put('/api/user-update-password').send(form).expect(200)
    expect(res.body).toEqual({})
  })

})
