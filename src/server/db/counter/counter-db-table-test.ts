import { CounterDB } from './counter-db'
import { objManCloseAllObjects, objManGetObject, objManNewSessionForTest } from '../../objman/object-man'

describe('CounterDB Table', () => {

  let cdb: CounterDB

  beforeAll(async () => {
    objManNewSessionForTest()
    cdb = await objManGetObject('CounterDB') as CounterDB
  })

  afterAll(async () => {
    await objManCloseAllObjects()
  })

  it('init table', async () => {
    await cdb.dropTable()
    await cdb.createTable()
  })
  it('table exists', async () => {
    expect(await cdb.db.findTable('counter')).toBeDefined()
  })
  it('drop table', async () => {
    await cdb.dropTable()
  })
  it('table does not exist', async () => {
    expect(await cdb.db.findTable('counter')).toBeUndefined()
  })

})
