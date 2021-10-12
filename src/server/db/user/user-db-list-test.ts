import { UserDB } from './user-db'
import { insertUserFix4 } from './fixture/user-fix'
import { objManCloseAllObjects, objManGetObject, objManNewSessionForTest } from '../../objman/object-man'

describe('UserDB.findUserList', () => {

  let udb: UserDB

  beforeAll(async () => {
    objManNewSessionForTest()
    udb = await objManGetObject('UserDB') as UserDB
  })

  afterAll(async () => {
    await objManCloseAllObjects()
  })

  it('init table', async () => {
    await udb.dropTable()
    await udb.createTable()
  })
  it('fill fix', async () => {
    await insertUserFix4(udb)
  })
  it('get list default opt', async () => {
    const l = await udb.findUserList()
    expect(l.length).toBe(4)
    // ordered by pdate desc
    expect(l[0].home).toBe('user2')
    expect(l[1].home).toBe('user3')
    expect(l[2].home).toBe('user1')
    expect(l[3].home).toBe('admin')
  })
  it('get offset 0, ps 3', async () => {
    const l = await udb.findUserList(0, 3)
    expect(l.length).toBe(3)
    // ordered by pdate desc
    expect(l[0].home).toBe('user2')
    expect(l[1].home).toBe('user3')
    expect(l[2].home).toBe('user1')
  })
  it('get offset 3, ps 3', async () => {
    const l = await udb.findUserList(3, 3)
    expect(l.length).toBe(1)
    // ordered by pdate desc
    expect(l[0].home).toBe('admin')
  })
  it('get offset 6, ps 3', async () => {
    const l = await udb.findUserList(6, 3)
    expect(l.length).toBe(0)
  })

})
