import { ValueDB } from './value-db'
import { omanCloseAllObjects, omanGetObject, omanNewSessionForTest } from '../../oman/oman'

describe('ValueDB Table', () => {

  let vdb: ValueDB

  beforeAll(async () => {
    omanNewSessionForTest()
    vdb = await omanGetObject('ValueDB') as ValueDB
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  it('init table', async () => {
    await vdb.dropTable()
    await vdb.createTable()
  })
  it('table exists', async () => {
    expect(await vdb.db.findTable('persist')).toBeDefined()
  })
  it('drop table', async () => {
    await vdb.dropTable()
  })
  it('table does not exist', async () => {
    expect(await vdb.db.findTable('persist')).toBeUndefined()
  })

})
