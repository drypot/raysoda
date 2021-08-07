import { Config, loadConfig } from '../config/config.js'
import { DBConn } from './db-conn.js'
import { Done, waterfall } from '../../lib/base/async2.js'

describe('DBConn', () => {

  let config: Config
  let db: DBConn

  beforeAll(done => {
    config = loadConfig('config/app-test.json')
    db = new DBConn(config)
    done()
  })

  afterAll(done => {
    db.close(done)
  })

  describe('create, drop, find Database', () => {
    it('should work', done => {
      waterfall(
        (done: Done) => {
          db.dropDatabase(err => {
            expect(err).toBeFalsy()
            done()
          })
        },
        (done: Done) => {
          db.findDatabase(config.mysqlDatabase, (err, r) => {
            expect(err).toBeFalsy()
            expect(r.length).toBe(0)
            done()
          })
        },
        (done: Done) => {
          db.createDatabase(err => {
            expect(err).toBeFalsy()
            done()
          })
        },
        (done: Done) => {
          db.findDatabase(config.mysqlDatabase, (err, r) => {
            expect(err).toBeFalsy()
            expect(r.length).toBe(1)
            done()
          })
        },
        (done: Done) => {
          db.dropDatabase(err => {
            expect(err).toBeFalsy()
            done()
          })
        },
        (done: Done) => {
          db.findDatabase(config.mysqlDatabase, (err, r) => {
            expect(err).toBeFalsy()
            expect(r.length).toBe(0)
            done()
          })
        },
        done
      )
    })
  })

})
