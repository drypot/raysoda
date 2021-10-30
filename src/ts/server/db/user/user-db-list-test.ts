import { ADMIN, USER1, USER2, USER3, userFixInsert4 } from '@server/db/user/fixture/user-fix'
import { UserDB } from '@server/db/user/user-db'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'

describe('UserDB List', () => {

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
    await userFixInsert4(udb)
  })
  it('get list default opt', async () => {
    const l = await udb.findUserList()
    expect(l.length).toBe(4)
    // ordered by pdate desc
    expect(l[0].home).toBe(USER2.home)
    expect(l[1].home).toBe(USER3.home)
    expect(l[2].home).toBe(USER1.home)
    expect(l[3].home).toBe(ADMIN.home)
  })
  it('get offset 0, ps 3', async () => {
    const l = await udb.findUserList(0, 3)
    expect(l.length).toBe(3)
    // ordered by pdate desc
    expect(l[0].home).toBe(USER2.home)
    expect(l[1].home).toBe(USER3.home)
    expect(l[2].home).toBe(USER1.home)
  })
  it('get offset 3, ps 3', async () => {
    const l = await udb.findUserList(3, 3)
    expect(l.length).toBe(1)
    // ordered by pdate desc
    expect(l[0].home).toBe(ADMIN.home)
  })
  it('get offset 6, ps 3', async () => {
    const l = await udb.findUserList(6, 3)
    expect(l.length).toBe(0)
  })

})
