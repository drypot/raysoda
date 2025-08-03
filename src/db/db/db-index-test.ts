import { closeAllObjects, initObjectContext } from '../../oman/oman.ts'
import { DB, getDatabase } from './db.ts'

describe('DB.createIndexIfNotExists', () => {

  let db: DB

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    db = await getDatabase()
  })

  afterAll(async () => {
    await closeAllObjects()
  })

  it('init table', async () => {
    await db.query('drop table if exists table1')
    await db.query('create table table1(id int, email varchar(64), primary key (id))')
  })
  it('index not exists', async () => {
    expect(await db.indexExists('table1', 'idxEmail')).toBeFalse()
  })
  it('create index', async () => {
    await db.createIndexIfNotExists('create index idxEmail on table1(email)')
  })
  it('index exists', async () => {
    expect(await db.indexExists('table1', 'idxEmail')).toBeTrue()
  })
  it('create again does not throw', async () => {
    await db.createIndexIfNotExists('create index idxEmail on table1(email)')
  })

})
