import { loadConfigSync } from '../../_util/config-loader'
import { DB } from './db'
import { Config } from '../../_type/config'

describe('DB.close', () => {

  let config: Config
  let db: DB

  beforeAll(() => {
    config = loadConfigSync('config/app-test.json')
    db = DB.from(config)
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