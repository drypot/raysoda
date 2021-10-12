import { DB } from './db'
import { objManGetObject, objManNewSession } from '../../objman/object-man'

describe('DB.close', () => {

  let db: DB

  beforeAll(async () => {
    objManNewSession('config/app-test.json')
    db = await objManGetObject('DB') as DB
  })

  afterAll(async () => {
    //await objManCloseAllObjects()
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
