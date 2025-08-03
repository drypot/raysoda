import { getPwMailDB, PwMailDB } from './pwmail-db.ts'
import { closeAllObjects, initObjectContext } from '../../oman/oman.ts'
import { DB, getDatabase } from '../db/db.ts'

describe('PwMailDB Table', () => {

  let db: DB
  let rdb: PwMailDB

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    db = await getDatabase()
    rdb = await getPwMailDB()
  })

  afterAll(async () => {
    await closeAllObjects()
  })

  it('drop table', async () => {
    await rdb.dropTable()
  })
  it('table not exists', async () => {
    expect(await db.tableExists('pwmail')).toBeFalse()
  })
  it('create table', async () => {
    await rdb.createTable()
  })
  it('table exists', async () => {
    expect(await db.tableExists('pwmail')).toBeTrue()
  })
  it('drop table', async () => {
    await rdb.dropTable()
  })
  it('table not exists', async () => {
    expect(await db.tableExists('pwmail')).toBeFalse()
  })

})
