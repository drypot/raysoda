import { Config, configFrom } from '../../app/config/config.js'
import { DB } from './db.js'

describe('DB', () => {

  let config: Config
  let db: DB

  beforeAll(() => {
    config = configFrom('config/app-test.json')
    db = DB.from(config)
  })

  afterAll(async () => {
    await db.close()
  })

  describe('query', () => {
    it('should work when result exists', async () => {
      const r = await db.query('select * from (select 1 as id) dummy where id = 1')
      expect(r[0].id).toBe(1)
    })
    it('should work when result does not exists', async () => {
      const r = await db.query('select * from (select 1 as id) dummy where id = 2')
      expect(r.length).toBe(0)
    })
    it('should fail with invalid sql', async () => {
      await expectAsync(db.query('select xxx')).toBeRejected()
    })
  })

})
