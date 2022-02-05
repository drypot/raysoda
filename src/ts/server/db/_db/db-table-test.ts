import { closeAllObjects, getObject, initObjectContext } from '@server/oman/oman'
import { DB } from '@server/db/_db/db'

describe('DB.*Table', () => {

  let db: DB

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    db = await getObject('DB') as DB
  })

  afterAll(async () => {
    await closeAllObjects()
  })

  it('create table', async () => {
    await db.query('drop table if exists table1')
    await db.query('create table table1(id int)')
  })
  it('find table returns table', async () => {
    expect(await db.getTable('table1')).toBeDefined()
  })
  it('drop table', async () => {
    await db.query('drop table if exists table1')
  })
  it('find table returns nothing', async () => {
    expect(await db.getTable('table1')).toBeUndefined()
  })

})
