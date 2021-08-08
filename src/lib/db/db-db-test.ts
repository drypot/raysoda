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

  afterAll(done => {
    db.close(done)
  })

  describe('create, drop, find Database', () => {
    it('should work', done => {
      waterfall(
        (done) => {
          db.dropDatabase(err => {
            expect(err).toBeFalsy()
            done()
          })
        },
        (done) => {
          db.findDatabase(config.mysqlDatabase, (err, r) => {
            expect(err).toBeFalsy()
            expect(r.length).toBe(0)
            done()
          })
        },
        (done) => {
          db.createDatabase(err => {
            expect(err).toBeFalsy()
            done()
          })
        },
        (done) => {
          db.findDatabase(config.mysqlDatabase, (err, r) => {
            expect(err).toBeFalsy()
            expect(r.length).toBe(1)
            done()
          })
        },
        (done) => {
          db.dropDatabase(err => {
            expect(err).toBeFalsy()
            done()
          })
        },
        (done) => {
          db.findDatabase(config.mysqlDatabase, (err, r) => {
            expect(err).toBeFalsy()
            expect(r.length).toBe(0)
            done()
          })
        }
      ).run(done)
    })
  })

})
