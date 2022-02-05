import { UserDB } from '@server/db/user/user-db'
import { closeAllObjects, getObject, initObjectContext } from '@server/oman/oman'
import { DB } from '@server/db/_db/db'

describe('UserDB Table', () => {

  let db: DB
  let udb: UserDB

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    db = await getObject('DB') as DB
    udb = await getObject('UserDB') as UserDB
  })

  afterAll(async () => {
    await closeAllObjects()
  })

  it('drop table', async () => {
    await udb.dropTable()
  })
  it('create table', async () => {
    await udb.createTable()
  })
  it('table exists', async () => {
    expect(await db.getTable('user')).toBeDefined()
  })
  it('drop table', async () => {
    await udb.dropTable()
  })
  it('table not exists', async () => {
    expect(await db.getTable('user')).toBeUndefined()
  })

})
