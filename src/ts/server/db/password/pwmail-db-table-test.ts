import { PwMailDB } from '@server/db/password/pwmail-db'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'
import { DB } from '@server/db/_db/db'

describe('PwMailDB Table', () => {

  let db: DB
  let rdb: PwMailDB

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    db = await omanGetObject('DB') as DB
    rdb = await omanGetObject('PwMailDB') as PwMailDB
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  it('drop table', async () => {
    await rdb.dropTable()
  })
  it('table not exists', async () => {
    expect(await db.findTable('pwmail')).toBeUndefined()
  })
  it('create table', async () => {
    await rdb.createTable()
  })
  it('table exists', async () => {
    expect(await db.findTable('pwmail')).toBeDefined()
  })
  it('drop table', async () => {
    await rdb.dropTable()
  })
  it('table not exists', async () => {
    expect(await db.findTable('pwmail')).toBeUndefined()
  })

})
