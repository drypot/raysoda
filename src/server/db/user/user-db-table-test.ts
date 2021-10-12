import { UserDB } from './user-db'
import { omanCloseAllObjects, omanGetObject, omanNewSessionForTest } from '../../oman/oman'

describe('UserDB.*Table', () => {

  let udb: UserDB

  beforeAll(async () => {
    omanNewSessionForTest()
    udb = await omanGetObject('UserDB') as UserDB
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  it('drop table', async () => {
    await udb.dropTable()
  })
  it('create table', async () => {
    await udb.createTable()
  })
  it('table exists', async () => {
    expect(await udb.db.findTable('user')).toBeDefined()
  })
  it('drop table', async () => {
    await udb.dropTable()
  })
  it('table not exists', async () => {
    expect(await udb.db.findTable('user')).toBeUndefined()
  })

})
