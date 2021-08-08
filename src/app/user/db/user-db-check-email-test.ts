import { Config, loadConfig } from '../../config/config.js'
import { DB } from '../../../lib/db/db.js'
import { waterfall } from '../../../lib/base/async2.js'
import { UserDB } from './user-db.js'
import { newUser } from '../domain/user-domain.js'

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

  describe('checkEmailUsable', () => {
    beforeAll(done => {
      waterfall(
        (done) => {
          udb.dropTable(done)
        },
        (done) => {
          udb.createTable(done)
        },
        (done) => {
          const objs = [
            newUser({ id: 1, name: 'Alice', home: 'Wonderland', email: 'alice@mail.com' }),
          ]
          db.insertObjects('user', objs, done)
        }
      ).run(done)
    })
    it('should pass when email is not in use', done => {
      udb.checkEmailUsable(0, 'snow@mail.com', (err, usable) => {
        expect(err).toBeFalsy()
        expect(usable).toBe(true)
        done()
      })
    })
    it('should fail when email is in use', done => {
      udb.checkEmailUsable(0, 'alice@mail.com', (err, usable) => {
        expect(err).toBeFalsy()
        expect(usable).toBe(false)
        done()
      })
    })
    it('should pass when email is mine', done => {
      udb.checkEmailUsable(1, 'alice@mail.com', (err, usable) => {
        expect(err).toBeFalsy()
        expect(usable).toBe(true)
        done()
      })
    })
  })

})
