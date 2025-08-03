import { CounterDB, getCounterDB } from './counter-db.ts'
import { closeAllObjects, initObjectContext } from '../../oman/oman.ts'
import { DB, getDatabase } from '../db/db.ts'

describe('CounterDB Table', () => {

  let db: DB
  let cdb: CounterDB

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    db = await getDatabase()
    cdb = await getCounterDB()
  })

  afterAll(async () => {
    await closeAllObjects()
  })

  it('init table', async () => {
    await cdb.dropTable()
    await cdb.createTable()
  })
  it('table exists', async () => {
    expect(await db.tableExists('counter')).toBeTrue()
  })
  it('drop table', async () => {
    await cdb.dropTable()
  })
  it('table does not exist', async () => {
    expect(await db.tableExists('counter')).toBeFalse()
  })

})
