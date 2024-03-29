import { closeAllObjects, getObject, initObjectContext } from '@server/oman/oman'
import { DB } from '@server/db/_db/db'

describe('DB.getMaxId', () => {

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
    await db.query('create table table1(id int)')
  })
  it('getMaxId returns 0', async () => {
    const maxId = await db.getMaxId('table1')
    expect(maxId).toBe(0)
  })
  it('fill table', async () => {
    const values = [[3], [5], [7]]
    await db.query('insert into table1 values ?', [values])
  })
  it('getMaxId returns max value', async () => {
    const maxId = await db.getMaxId('table1')
    expect(maxId).toBe(7)
  })
  it('getMaxId fails if table not exist', async () => {
    await expectAsync(db.getMaxId('table2')).toBeRejected()
  })

})
