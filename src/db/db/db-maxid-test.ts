import { closeAllObjects, initObjectContext } from '../../oman/oman.ts'
import { DB, getDatabase } from './db.ts'

describe('DB.getMaxId', () => {

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
    await db.query('create table table1(id int)')
  })
  it('getMaxId returns 0', async () => {
    const maxId = await db.getMaxId('table1')
    expect(maxId).toBe(0)
  })
  it('fill table', async () => {
    const values = [[3], [5], [7]]
    const r = await db.update('insert into table1 values ?', [values])
    expect(r.affectedRows).toBe(3)
  })
  it('getMaxId returns max value', async () => {
    const maxId = await db.getMaxId('table1')
    expect(maxId).toBe(7)
  })
  it('getMaxId fails if table not exist', async () => {
    await expectAsync(db.getMaxId('table2')).toBeRejected()
  })

})
