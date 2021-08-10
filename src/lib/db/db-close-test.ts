import { Config, loadConfig } from '../../app/config/config.js'
import { DB } from './db.js'

describe('DB', () => {

  let config: Config
  let db: DB

  beforeAll(() => {
    config = loadConfig('config/app-test.json')
    db = new DB(config)
  })

  describe('close', () => {
    it('should work', async () => {
      await db.query('select 3 as v')
      await db.close()
      await expectAsync(db.query('select 3 as v')).toBeRejected()
      await expectAsync(db.close()).toBeRejected()
    })
  })

})
