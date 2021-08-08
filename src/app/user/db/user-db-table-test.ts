import { Config, loadConfig } from '../../config/config.js'
import { DB } from '../../../lib/db/db.js'
import { setTimeout2, waterfall } from '../../../lib/base/async2.js'
import { UserDB } from './user-db.js'

describe('UserDB', () => {

  let config: Config
  let db: DB
  let udb: UserDB

  beforeAll(done => {
    config = loadConfig('config/app-test.json')
    db = new DB(config)
    udb = new UserDB(db)
    db.createDatabase(done)
  })

  afterAll(done => {
    db.close(done)
  })

  describe('createTable', () => {
    it('should work', done => {
      waterfall(
        (done) => {
          udb.dropTable(done)
        },
        (done) => {
          udb.createTable(done)
        },
        (done) => {
          db.findTable('user', (err, r) => {
            expect(err).toBeFalsy()
            expect(r.length).toBe(1)
            done()
          })
        }
      ).run(done)
    })
  })

  describe('dropTable', () => {
    it('should work', done => {
      waterfall(
        (done) => {
          udb.createTable(done)
        },
        (done) => {
          udb.dropTable(done)
        },
        (done) => {
          db.findTable('user', (err, r) => {
            expect(err).toBeFalsy()
            expect(r.length).toBe(0)
            done()
          })
        },
      ).run(done)
    })
  })

  describe('getNewId', () => {
    it('should work', () => {
      expect(udb.getNewUserId()).toBe(1)
      expect(udb.getNewUserId()).toBe(2)
      expect(udb.getNewUserId()).toBe(3)
    })
  })

})
