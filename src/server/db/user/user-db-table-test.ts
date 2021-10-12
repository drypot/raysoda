import { UserDB } from './user-db'
import { objManCloseAllObjects, objManGetObject, objManNewSessionForTest } from '../../objman/object-man'

describe('UserDB.*Table', () => {

  let udb: UserDB

  beforeAll(async () => {
    objManNewSessionForTest()
    udb = await objManGetObject('UserDB') as UserDB
  })

  afterAll(async () => {
    await objManCloseAllObjects()
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
