import { PwMailDB } from '@server/db/password/pwmail-db'
import { closeAllObjects, getObject, initObjectContext } from '@server/oman/oman'
import { DB } from '@server/db/_db/db'

describe('PwMailDB Table', () => {

  let db: DB
  let rdb: PwMailDB

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    db = await getObject('DB') as DB
    rdb = await getObject('PwMailDB') as PwMailDB
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
