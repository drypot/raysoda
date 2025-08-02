import { ADMIN, insertUserFix4, USER1, USER2, USER3 } from './fixture/user-fix.js'
import { getUserDB, UserDB } from './user-db.js'
import { closeAllObjects, initObjectContext } from '../../oman/oman.js'

describe('UserDB List', () => {

  let udb: UserDB

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    udb = await getUserDB()
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
  it('get list default opt', async () => {
    const l = await udb.getUserList()
    expect(l.length).toBe(4)
    // ordered by pdate desc
    expect(l[0].home).toBe(USER2.home)
    expect(l[1].home).toBe(USER3.home)
    expect(l[2].home).toBe(USER1.home)
    expect(l[3].home).toBe(ADMIN.home)
  })
  it('get offset 0, ps 3', async () => {
    const l = await udb.getUserList(0, 3)
    expect(l.length).toBe(3)
    // ordered by pdate desc
    expect(l[0].home).toBe(USER2.home)
    expect(l[1].home).toBe(USER3.home)
    expect(l[2].home).toBe(USER1.home)
  })
  it('get offset 3, ps 3', async () => {
    const l = await udb.getUserList(3, 3)
    expect(l.length).toBe(1)
    // ordered by pdate desc
    expect(l[0].home).toBe(ADMIN.home)
  })
  it('get offset 6, ps 3', async () => {
    const l = await udb.getUserList(6, 3)
    expect(l.length).toBe(0)
  })

})
