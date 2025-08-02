import { getUserDB, UserDB } from './user-db.js'
import { closeAllObjects, initObjectContext } from '../../oman/oman.js'
import { DB, getDatabase } from '../db/db.js'

describe('UserDB Table', () => {

  let db: DB
  let udb: UserDB

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    db = await getDatabase()
    udb = await getUserDB()
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
