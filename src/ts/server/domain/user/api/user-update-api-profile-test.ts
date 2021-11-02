import supertest, { SuperAgentTest } from 'supertest'
import { useUserUpdateApi } from '@server/domain/user/api/user-update-api'
import { ADMIN_LOGIN_FORM, USER1_LOGIN_FORM, userFixInsert4 } from '@server/db/user/fixture/user-fix'
import {
  EMAIL_DUPE,
  EMAIL_PATTERN,
  EMAIL_RANGE,
  HOME_DUPE,
  HOME_EMPTY,
  HOME_RANGE,
  NAME_DUPE,
  NAME_EMPTY,
  NAME_RANGE,
  NOT_AUTHENTICATED,
  NOT_AUTHORIZED
} from '@common/type/error-const'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'
import { useUserAuthApi } from '@server/domain/user/api/user-auth-api'
import { Express2 } from '@server/express/express2'
import { userLoginForTest } from '@server/domain/user/api/user-auth-api-fixture'
import { UserDB } from '@server/db/user/user-db'
import { UserUpdateProfileForm } from '@common/type/user-form'
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
    await userFixInsert4(udb)
  })

  it('update user1 without login', async () => {
    const form = {
      id: 1,
      name: 'User 11'
    }
    const res = await sat.put('/api/user-update-profile').send(form).expect(200)
    expect(res.body.err).toContain(NOT_AUTHENTICATED)
  })

  it('login as user1', async () => {
    await userLoginForTest(sat, USER1_LOGIN_FORM)
  })

  // Update

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
  it('update user1', async () => {
    const form: UserUpdateProfileForm = {
      id: 1, name: 'name11', home: 'home11', email: 'mail11@mail.test', profile: 'profile 11'
    }
    const res = await sat.put('/api/user-update-profile').send(form).expect(200)
    expect(res.body).toEqual({})
  })
  it('check db after update', async () => {
    const user = await udb.getCachedById(1)
    if (!user) throw new Error()
    expect(dupe(user)).toEqual({
      id: 1, name: 'name11', home: 'home11', email: 'mail11@mail.test',
      hash: '$2a$10$bP0BJpAzAUNFZ2Ejo57Gruhg8LkIQ9./EvfUjjyYqwCf3ZDhQZC1K',
      status: 'v', admin: false,
      cdate: new Date(2003, 0, 17),
      adate: user.adate,
      pdate: new Date(2019, 0, 10),
      profile: 'profile 11'
    })
  })

  // Check email.

  it('duped email fails', async () => {
    const form = { id: 1, email: 'mail2@mail.test' }
    const res = await sat.put('/api/user-update-profile').send(form).expect(200)
    expect(res.body.err).toContain(EMAIL_DUPE)
  })
  it('duped case email fails', async () => {
    const form = { id: 1, email: 'MAIL2@MAIL.TEST' }
    const res = await sat.put('/api/user-update-profile').send(form).expect(200)
    expect(res.body.err).toContain(EMAIL_DUPE)
  })

  it('length 7 email fails', async () => {
    const form = { id: 1, email: 'x'.repeat(7) }
    const res = await sat.put('/api/user-update-profile').send(form).expect(200)
    expect(res.body.err).toContain(EMAIL_RANGE)
  })
  it('length 8 email ok', async () => {
    const form = { id: 1, email: 'x'.repeat(8) }
    const res = await sat.put('/api/user-update-profile').send(form).expect(200)
    expect(res.body.err).not.toContain(EMAIL_RANGE)
  })
  it('length 64 email ok', async () => {
    const form = { id: 1, email: 'x'.repeat(64) }
    const res = await sat.put('/api/user-update-profile').send(form).expect(200)
    expect(res.body.err).not.toContain(EMAIL_RANGE)
  })
  it('length 65 email fails', async () => {
    const form = { id: 1, email: 'x'.repeat(65) }
    const res = await sat.put('/api/user-update-profile').send(form).expect(200)
    expect(res.body.err).toContain(EMAIL_RANGE)
  })
  it('invalid email format fails', async () => {
    const form = { id: 1, email: 'x'.repeat(8) }
    const res = await sat.put('/api/user-update-profile').send(form).expect(200)
    expect(res.body.err).toContain(EMAIL_PATTERN)
  })

  // Check name

  it('duped name fails', async () => {
    const form = { id: 1, name: 'name2' }
    const res = await sat.put('/api/user-update-profile').send(form).expect(200)
    expect(res.body.err).toContain(NAME_DUPE)
  })
  it('duped case name fails', async () => {
    const form = { id: 1, name: 'NAME2' }
    const res = await sat.put('/api/user-update-profile').send(form).expect(200)
    expect(res.body.err).toContain(NAME_DUPE)
  })

  it('empty name fails', async () => {
    const form = { id: 1, name: '' }
    const res = await sat.put('/api/user-update-profile').send(form).expect(200)
    expect(res.body.err).toContain(NAME_EMPTY)
  })
  it('length 1 name ok', async () => {
    const form = { id: 1, name: 'x' }
    const res = await sat.put('/api/user-update-profile').send(form).expect(200)
    expect(res.body.err).not.toContain(NAME_RANGE)
  })
  it('length 32 name ok', async () => {
    const form = { id: 1, name: 'x'.repeat(32) }
    const res = await sat.put('/api/user-update-profile').send(form).expect(200)
    expect(res.body.err).not.toContain(NAME_RANGE)
  })
  it('length 33 name fails', async () => {
    const form = { id: 1, name: 'x'.repeat(33) }
    const res = await sat.put('/api/user-update-profile').send(form).expect(200)
    expect(res.body.err).toContain(NAME_RANGE)
  })

  // Check home

  it('duped home fails', async () => {
    const form = { id: 1, home: 'home2' }
    const res = await sat.put('/api/user-update-profile').send(form).expect(200)
    expect(res.body.err).toContain(HOME_DUPE)
  })
  it('duped case home fails', async () => {
    const form = { id: 1, home: 'HOME2' }
    const res = await sat.put('/api/user-update-profile').send(form).expect(200)
    expect(res.body.err).toContain(HOME_DUPE)
  })

  it('empty home fails', async () => {
    const form = { id: 1, home: '' }
    const res = await sat.put('/api/user-update-profile').send(form).expect(200)
    expect(res.body.err).toContain(HOME_EMPTY)
  })
  it('length 1 home ok', async () => {
    const form = { id: 1, home: 'x' }
    const res = await sat.put('/api/user-update-profile').send(form).expect(200)
    expect(res.body.err).not.toContain(HOME_RANGE)
  })
  it('length 32 home ok', async () => {
    const form = { id: 1, home: 'x'.repeat(32) }
    const res = await sat.put('/api/user-update-profile').send(form).expect(200)
    expect(res.body.err).not.toContain(HOME_RANGE)
  })
  it('length 33 home fails', async () => {
    const form = { id: 1, home: 'x'.repeat(33) }
    const res = await sat.put('/api/user-update-profile').send(form).expect(200)
    expect(res.body.err).toContain(HOME_RANGE)
  })

  // Check permission

  it('update user2 by user1 fails', async () => {
    const form = { id: 2, name: 'name22' }
    const res = await sat.put('/api/user-update-profile').send(form).expect(200)
    expect(res.body.err).toContain(NOT_AUTHORIZED)
  })
  it('login as admin', async () => {
    await userLoginForTest(sat, ADMIN_LOGIN_FORM)
  })
  it('update user2 by admin works', async () => {
    const form: UserUpdateProfileForm = {
      id: 2, name: 'name22', home: 'home22', email: 'mail22@mail.test', profile: 'profile 22'
    }
    const res = await sat.put('/api/user-update-profile').send(form).expect(200)
    expect(res.body).toEqual({})
  })

})
