import { userFixInsert4 } from '@server/db/user/fixture/user-fix'
import { UserDB } from '@server/db/user/user-db'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'

describe('UserDB.searchUser', () => {

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
  it('search user1', async () => {
    const l = await udb.searchUser('user1')
    expect(l.length).toBe(1)
    expect(l[0].home).toBe('user1')
  })
  it('search USER1', async () => {
    const l = await udb.searchUser('USER1')
    expect(l.length).toBe(1)
    expect(l[0].home).toBe('user1')
  })
  it('search User 1', async () => {
    const l = await udb.searchUser('User 1')
    expect(l.length).toBe(1)
    expect(l[0].home).toBe('user1')
  })
  it('search user1@mail.test as user', async () => {
    const l = await udb.searchUser('user1@mail.test')
    expect(l.length).toBe(0)
  })
  it('search user1@mail.test as admin', async () => {
    const l = await udb.searchUser('user1@mail.test', 0, 100, true)
    expect(l.length).toBe(1)
    expect(l[0].home).toBe('user1')
  })
  it('search userx', async () => {
    const l = await udb.searchUser('userx')
    expect(l.length).toBe(0)
  })

})
