import { ValueDB } from './value-db'
import { objManCloseAllObjects, objManGetObject, objManNewSessionForTest } from '../../objman/object-man'

describe('ValueDB Table', () => {

  let vdb: ValueDB

  beforeAll(async () => {
    objManNewSessionForTest()
    vdb = await objManGetObject('ValueDB') as ValueDB
  })

  afterAll(async () => {
    await objManCloseAllObjects()
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
