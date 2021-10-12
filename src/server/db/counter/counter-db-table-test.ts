import { CounterDB } from './counter-db'
import { omanCloseAllObjects, omanGetObject, omanNewSessionForTest } from '../../oman/oman'

describe('CounterDB Table', () => {

  let cdb: CounterDB

  beforeAll(async () => {
    omanNewSessionForTest()
    cdb = await omanGetObject('CounterDB') as CounterDB
  })

  afterAll(async () => {
    await omanCloseAllObjects()
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
