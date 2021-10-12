import { DB } from './db'
import { objManCloseAllObjects, objManGetObject, objManNewSessionForTest } from '../../objman/object-man'

describe('DB.queryOne', () => {

  let db: DB

  beforeAll(async () => {
    objManNewSessionForTest()
    db = await objManGetObject('DB') as DB
  })

  afterAll(async () => {
    await objManCloseAllObjects()
  })

  it('when there is something', async () => {
    const r = await db.queryOne('select * from (select 1 as id) dummy where id = 1')
    expect(r.id).toBe(1)
  })
  it('when there is nothing', async () => {
    const r = await db.queryOne('select * from (select 1 as id) dummy where id = 2')
    expect(r).toBe(undefined)
  })
  it('when sql invalid', async () => {
    await expectAsync(db.queryOne('select xxx')).toBeRejected()
  })

})
