import { closeAllObjects, getObject, initObjectContext } from '@server/oman/oman'
import { DB } from '@server/db/_db/db'

describe('DB.createIndexIfNotExists', () => {

  let db: DB

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    db = await getObject('DB') as DB
  })

  afterAll(async () => {
    await closeAllObjects()
  })

  it('init table', async () => {
    await db.query('drop table if exists table1')
    await db.query('create table table1(id int, email varchar(64), primary key (id))')
  })
  it('find index returns nothing', async () => {
    expect(await db.getIndex('table1', 'idxEmail')).toBeUndefined()
  })
  it('create index', async () => {
    await db.createIndexIfNotExists('create index idxEmail on table1(email)')
  })
  it('find index returns table', async () => {
    expect(await db.getIndex('table1', 'idxEmail')).toBeDefined()
  })
  it('create again does not throw', async () => {
    await db.createIndexIfNotExists('create index idxEmail on table1(email)')
  })

})
