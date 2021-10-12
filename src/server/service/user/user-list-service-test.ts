import { UserDB } from '../../db/user/user-db'
import { insertUserFix4 } from '../../db/user/fixture/user-fix'
import { userListService } from './user-list-service'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '../../oman/oman'

describe('userListService', () => {

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
    await insertUserFix4(udb)
  })
  it('get list default opt', async () => {
    const l = await userListService(udb)
    expect(l.length).toBe(4)
    // ordered by pdate desc
    expect(l[0].home).toBe('user2')
    expect(l[1].home).toBe('user3')
    expect(l[2].home).toBe('user1')
    expect(l[3].home).toBe('admin')
  })
  it('get p 1, ps 3', async () => {
    const l = await userListService(udb, 1, 3)
    expect(l.length).toBe(3)
    // ordered by pdate desc
    expect(l[0].home).toBe('user2')
    expect(l[1].home).toBe('user3')
    expect(l[2].home).toBe('user1')
  })
  it('get p 2, ps 3', async () => {
    const l = await userListService(udb, 2, 3)
    expect(l.length).toBe(1)
    // ordered by pdate desc
    expect(l[0].home).toBe('admin')
  })
  it('get p 3, ps 3', async () => {
    const l = await userListService(udb, 3, 3)
    expect(l.length).toBe(0)
  })

})
