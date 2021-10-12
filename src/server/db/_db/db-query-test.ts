import { DB } from './db'
import { objManCloseAllObjects, objManGetObject, objManNewSessionForTest } from '../../objman/object-man'

describe('DB.query', () => {

  let db: DB

  beforeAll(async () => {
    objManNewSessionForTest()
    db = await objManGetObject('DB') as DB
  })

  afterAll(async () => {
    await objManCloseAllObjects()
  })

  it('when there is something', async () => {
    const r = await db.query('select * from (select 1 as id) dummy where id = 1')
    expect(r[0].id).toBe(1)
  })
  it('when there is nothing', async () => {
    const r = await db.query('select * from (select 1 as id) dummy where id = 2')
    expect(r.length).toBe(0)
  })
  it('when sql invalid', async () => {
    await expectAsync(db.query('select xxx')).toBeRejected()
  })

})
