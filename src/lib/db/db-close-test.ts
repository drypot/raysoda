import { Config, loadConfig } from '../../app/config/config.js'
import { DB } from './db.js'
import { waterfall } from '../base/async2.js'

describe('DB', () => {

  let config: Config
  let db: DB

  beforeAll(done => {
    config = loadConfig('config/app-test.json')
    db = new DB(config)
    done()
  })

  describe('close', () => {
    it('should work', done => {
      waterfall(
        (done) => {
          db.query('select 3 as v', (err, r) => {
            expect(err).toBeFalsy()
            expect(r[0].v).toBe(3)
            done()
          })
        },
        (done) => {
          db.close((err) => {
            expect(err).toBeFalsy()
            done()
          })
        },
        (done) => {
          db.query('select 3 as v', (err, r) => {
            expect(err).toBeTruthy()
            done()
          })
        },
        (done) => {
          db.close((err) => {
            expect(err).toBeTruthy()
            done()
          })
        }
      ).run(done)
    })
  })

})
