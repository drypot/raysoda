import { UserDB } from '@server/db/user/user-db'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'
import { userFixInsert1 } from '@server/db/user/fixture/user-fix'
import { dupe } from '@common/util/object2'
import { User } from '@common/type/user'

describe('UserDB.update', () => {

  let udb: UserDB

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    udb = await omanGetObject('UserDB') as UserDB
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  it('init table', async () => {
    await udb.dropTable()
    await udb.createTable()
  })
  it('fill fix', async () => {
    await userFixInsert1(udb)
  })
  it('check db before update', async () => {
    const user = await udb.getCachedById(1)
    if (!user) throw new Error()
    expect(dupe(user)).toEqual({
      id: 1, name: 'name1', home: 'home1', email: 'mail1@mail.test',
      hash: '$2a$10$bP0BJpAzAUNFZ2Ejo57Gruhg8LkIQ9./EvfUjjyYqwCf3ZDhQZC1K',
      status: 'v', admin: false,
      cdate: new Date(2003, 0, 17),
      adate: new Date(2003, 0, 17),
      pdate: new Date(2019, 0, 10),
      profile: ''
    })
  })
  it('update name', async () => {
    const form: Partial<User> = {
      name: 'name2', home: 'home2', email: 'mail2@mail.test'
    }
    await udb.updateUserById(1, form)
  })
  it('check db after update name', async () => {
    const user = await udb.getCachedById(1)
    if (!user) throw new Error()
    expect(dupe(user)).toEqual({
      id: 1, name: 'name2', home: 'home2', email: 'mail2@mail.test',
      hash: '$2a$10$bP0BJpAzAUNFZ2Ejo57Gruhg8LkIQ9./EvfUjjyYqwCf3ZDhQZC1K',
      status: 'v', admin: false,
      cdate: new Date(2003, 0, 17),
      adate: new Date(2003, 0, 17),
      pdate: new Date(2019, 0, 10),
      profile: ''
    })
  })
  it('update hash', async () => {
    const form: Partial<User> = {
      hash: 'xxx'
    }
    await udb.updateUserByEmail('mail2@mail.test', form)
  })
  it('check db after update hash', async () => {
    const user = await udb.getCachedById(1)
    if (!user) throw new Error()
    expect(dupe(user)).toEqual({
      id: 1, name: 'name2', home: 'home2', email: 'mail2@mail.test',
      hash: 'xxx',
      status: 'v', admin: false,
      cdate: new Date(2003, 0, 17),
      adate: new Date(2003, 0, 17),
      pdate: new Date(2019, 0, 10),
      profile: ''
    })
  })
  it('update status', async () => {
    const form: Partial<User> = {
      status: 'd', admin: true, profile: 'yyy'
    }
    await udb.updateUserById(1, form)
  })
  it('check db after update hash', async () => {
    const user = await udb.getCachedById(1)
    if (!user) throw new Error()
    expect(dupe(user)).toEqual({
      id: 1, name: 'name2', home: 'home2', email: 'mail2@mail.test',
      hash: 'xxx',
      status: 'd', admin: true,
      cdate: new Date(2003, 0, 17),
      adate: new Date(2003, 0, 17),
      pdate: new Date(2019, 0, 10),
      profile: 'yyy'
    })
  })
  it('update date', async () => {
    const form: Partial<User> = {
      adate: new Date(2021, 9, 31),
      pdate: new Date(2021, 7, 15),
    }
    await udb.updateUserById(1, form)
  })
  it('check db after update date', async () => {
    const user = await udb.getCachedById(1)
    if (!user) throw new Error()
    expect(dupe(user)).toEqual({
      id: 1, name: 'name2', home: 'home2', email: 'mail2@mail.test',
      hash: 'xxx',
      status: 'd', admin: true,
      cdate: new Date(2003, 0, 17),
      adate: new Date(2021, 9, 31),
      pdate: new Date(2021, 7, 15),
      profile: 'yyy'
    })
  })
})
