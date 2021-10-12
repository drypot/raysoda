import { ResetDB } from './reset-db'
import { objManCloseAllObjects, objManGetObject, objManNewSessionForTest } from '../../objman/object-man'

describe('ResetDB Table', () => {

  let rdb: ResetDB

  beforeAll(async () => {
    objManNewSessionForTest()
    rdb = await objManGetObject('ResetDB') as ResetDB
  })

  afterAll(async () => {
    await objManCloseAllObjects()
  })

  it('drop table', async () => {
    await rdb.dropTable()
  })
  it('table not exists', async () => {
    expect(await rdb.db.findTable('pwreset')).toBeUndefined()
  })
  it('create table', async () => {
    await rdb.createTable()
  })
  it('table exists', async () => {
    expect(await rdb.db.findTable('pwreset')).toBeDefined()
  })
  it('drop table', async () => {
    await rdb.dropTable()
  })
  it('table not exists', async () => {
    expect(await rdb.db.findTable('pwreset')).toBeUndefined()
  })

})
