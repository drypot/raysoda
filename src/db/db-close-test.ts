import { Config, configFrom } from '../config/config.js'
import { DB } from './db.js'

describe('DB', () => {

  let config: Config
  let db: DB

  beforeAll(() => {
    config = configFrom('config/app-test.json')
    db = DB.from(config)
  })

  describe('close', () => {
    it('query runs', async () => {
      await db.query('select 3 as v')
    })
    it('close works', async () => {
      await db.close()
    })
    it('query fails', async () => {
      await expectAsync(db.query('select 3 as v')).toBeRejected()
    })
    it('close fails', async () => {
      await expectAsync(db.close()).toBeRejected()
    })
  })

})
