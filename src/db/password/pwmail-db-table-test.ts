import { getPwMailDB, PwMailDB } from './pwmail-db.js'
import { closeAllObjects, initObjectContext } from '../../oman/oman.js'
import { DB, getDatabase } from '../db/db.js'

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
    expect(await db.getTable('pwmail')).toBeUndefined()
  })
  it('create table', async () => {
    await rdb.createTable()
  })
  it('table exists', async () => {
    expect(await db.getTable('pwmail')).toBeDefined()
  })
  it('drop table', async () => {
    await rdb.dropTable()
  })
  it('table not exists', async () => {
    expect(await db.getTable('pwmail')).toBeUndefined()
  })

})
