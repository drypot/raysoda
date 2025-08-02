import { insertUserFix4, USER1 } from './fixture/user-fix.js'
import { UserDB } from './user-db.js'
import { closeAllObjects, getObject, initObjectContext } from '../../oman/oman.js'

import './user-db.js'

describe('UserDB Search', () => {

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
    await insertUserFix4(udb)
  })
  it('search by name', async () => {
    const l = await udb.searchUser(USER1.name)
    expect(l.length).toBe(1)
    expect(l[0].name).toBe(USER1.name)
  })
  it('search by name case', async () => {
    const l = await udb.searchUser(USER1.name.toUpperCase())
    expect(l.length).toBe(1)
    expect(l[0].name).toBe(USER1.name)
  })
  it('search by home', async () => {
    const l = await udb.searchUser(USER1.home)
    expect(l.length).toBe(1)
    expect(l[0].home).toBe(USER1.home)
  })
  it('search by home case', async () => {
    const l = await udb.searchUser(USER1.home.toUpperCase())
    expect(l.length).toBe(1)
    expect(l[0].home).toBe(USER1.home)
  })
  it('search by email as user fails', async () => {
    const l = await udb.searchUser(USER1.email)
    expect(l.length).toBe(0)
  })
  it('search by email as admin works', async () => {
    const l = await udb.searchUser(USER1.email, 0, 100, true)
    expect(l.length).toBe(1)
    expect(l[0].name).toBe(USER1.name)
  })
  it('search invalid empty', async () => {
    const l = await udb.searchUser('xxx')
    expect(l.length).toBe(0)
  })

})
