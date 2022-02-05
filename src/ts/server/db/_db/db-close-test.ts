import { getObject, initObjectContext } from '@server/oman/oman'
import { DB } from '@server/db/_db/db'

describe('DB.close', () => {

  let db: DB

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    db = await getObject('DB') as DB
  })

  afterAll(async () => {
    //await omanCloseAllObjects()
  })

  it('when connected, query runs', async () => {
    await db.query('select 3 as v')
  })
  it('close conn', async () => {
    await db.close()
  })
  it('when disconnected, query fails', async () => {
    await expectAsync(db.query('select 3 as v')).toBeRejected()
  })
  it('close conn again fails', async () => {
    await expectAsync(db.close()).toBeRejected()
  })

})
