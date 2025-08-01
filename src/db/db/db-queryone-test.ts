import { closeAllObjects, getObject, initObjectContext } from '../../oman/oman.js'
import { DB } from './db.js'

describe('DB.queryOne', () => {

  let db: DB

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    db = await getObject('DB') as DB
  })

  afterAll(async () => {
    await closeAllObjects()
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
