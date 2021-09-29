import { configFrom } from '../../_util/config-loader.js'
import { DB } from './db.js'
import { Config } from '../../_type/config.js'

describe('DB', () => {

  let config: Config
  let db: DB

  beforeAll(() => {
    config = configFrom('config/app-test.json')
    db = DB.from(config)
  })

  describe('close', () => {
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

})
