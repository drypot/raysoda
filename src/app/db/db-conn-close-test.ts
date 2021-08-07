import { Config, loadConfig } from '../config/config.js'
import { DBConn } from './db-conn.js'
import { Done, waterfall } from '../../lib/base/async2.js'
import exp from 'constants'

describe('DBConn', () => {

  let config: Config
  let db: DBConn

  beforeAll(done => {
    config = loadConfig('config/app-test.json')
    db = new DBConn(config)
    done()
  })

  describe('close', () => {
    it('should work', done => {
      waterfall(
        (done: Done) => {
          db.conn.query('select 3 as v', (err, r) => {
            expect(err).toBeFalsy()
            expect(r[0].v).toBe(3)
            done()
          })
        },
        (done: Done) => {
          db.close((err) => {
            expect(err).toBeFalsy()
            done()
          })
        },
        (done: Done) => {
          db.conn.query('select 3 as v', (err, r) => {
            expect(err).toBeTruthy()
            done()
          })
        },
        (done: Done) => {
          db.close((err) => {
            expect(err).toBeTruthy()
            done()
          })
        },
        done
      )
    })
  })
})
