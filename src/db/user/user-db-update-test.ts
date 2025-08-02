import { UserDB } from './user-db.js'
import { closeAllObjects, getObject, initObjectContext } from '../../oman/oman.js'
import { insertUserFix1 } from './fixture/user-fix.js'
import { dupe } from '../../common/util/object2.js'
import { User } from '../../common/type/user.js'

describe('UserDB.update', () => {

  let udb: UserDB

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    udb = await getObject('UserDB') as UserDB
  })

  afterAll(async () => {
    await closeAllObjects()
  })

  it('init table', async () => {
    await udb.dropTable()
    await udb.createTable()
  })
  it('fill fix', async () => {
    await insertUserFix1(udb)
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
      name: 'name11', home: 'home11', email: 'mail11@mail.test'
    }
    await udb.updateUserById(1, form)
  })
  it('check db after update name', async () => {
    const user = await udb.getCachedById(1)
    if (!user) throw new Error()
    expect(dupe(user)).toEqual({
      id: 1, name: 'name11', home: 'home11', email: 'mail11@mail.test',
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
    await udb.updateUserByEmail('mail11@mail.test', form)
  })
  it('check db after update hash', async () => {
    const user = await udb.getCachedById(1)
    if (!user) throw new Error()
    expect(dupe(user)).toEqual({
      id: 1, name: 'name11', home: 'home11', email: 'mail11@mail.test',
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
      id: 1, name: 'name11', home: 'home11', email: 'mail11@mail.test',
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
      id: 1, name: 'name11', home: 'home11', email: 'mail11@mail.test',
      hash: 'xxx',
      status: 'd', admin: true,
      cdate: new Date(2003, 0, 17),
      adate: new Date(2021, 9, 31),
      pdate: new Date(2021, 7, 15),
      profile: 'yyy'
    })
  })
})
