import { CounterDB } from '@server/db/counter/counter-db'
import { closeAllObjects, getObject, initObjectContext } from '@server/oman/oman'
import { DB } from '@server/db/_db/db'

describe('CounterDB Table', () => {

  let db: DB
  let cdb: CounterDB

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    db = await getObject('DB') as DB
    cdb = await getObject('CounterDB') as CounterDB
  })

  afterAll(async () => {
    await closeAllObjects()
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
