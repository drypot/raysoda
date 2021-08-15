import { Config, configFrom } from '../../app/config/config.js'
import { DB } from './db.js'

describe('DB', () => {

  let config: Config
  let db: DB

  beforeAll(() => {
    config = configFrom('config/app-test.json')
    db = DB.from(config)
  })

  describe('close scenario', () => {
    it('query should work', async () => {
      await db.query('select 3 as v')
    })
    it('after close', async () => {
      await db.close()
    })
    it('query should fail', async () => {
      await expectAsync(db.query('select 3 as v')).toBeRejected()
    })
    it('close should fail', async () => {
      await expectAsync(db.close()).toBeRejected()
    })
  })

})
