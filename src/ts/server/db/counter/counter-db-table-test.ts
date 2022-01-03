import { CounterDB } from '@server/db/counter/counter-db'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'
import { DB } from '@server/db/_db/db'

describe('CounterDB Table', () => {

  let db: DB
  let cdb: CounterDB

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    db = await omanGetObject('DB') as DB
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
    expect(await db.getTable('counter')).toBeDefined()
  })
  it('drop table', async () => {
    await cdb.dropTable()
  })
  it('table does not exist', async () => {
    expect(await db.getTable('counter')).toBeUndefined()
  })

})
