import { ResetDB } from './reset-db'
import { omanCloseAllObjects, omanGetObject, omanNewSessionForTest } from '../../oman/oman'

describe('ResetDB Table', () => {

  let rdb: ResetDB

  beforeAll(async () => {
    omanNewSessionForTest()
    rdb = await omanGetObject('ResetDB') as ResetDB
  })

  afterAll(async () => {
    await omanCloseAllObjects()
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
