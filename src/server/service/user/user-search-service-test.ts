import { UserDB } from '../../db/user/user-db'
import { insertUserFix4 } from '../../db/user/fixture/user-fix'
import { userSearchService } from './user-search-service'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '../../oman/oman'

describe('userSearchService', () => {

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
  it('search user1', async () => {
    const l = await userSearchService(udb, 'user1')
    expect(l.length).toBe(1)
    expect(l[0].home).toBe('user1')
  })
  it('search USER1', async () => {
    const l = await userSearchService(udb, 'USER1')
    expect(l.length).toBe(1)
    expect(l[0].home).toBe('user1')
  })
  it('search User 1', async () => {
    const l = await userSearchService(udb, 'User 1')
    expect(l.length).toBe(1)
    expect(l[0].home).toBe('user1')
  })
  it('search user1@mail.test as user', async () => {
    const l = await userSearchService(udb, 'user1@mail.test')
    expect(l.length).toBe(0)
  })
  it('search user1@mail.test as admin', async () => {
    const l = await userSearchService(udb, 'user1@mail.test', 1, 100, true)
    expect(l.length).toBe(1)
    expect(l[0].home).toBe('user1')
  })
  it('search userx', async () => {
    const l = await userSearchService(udb, 'userx')
    expect(l.length).toBe(0)
  })

})
