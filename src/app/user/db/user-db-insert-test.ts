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

  describe('insertUser', () => {
    beforeAll(done => {
      waterfall(
        (done) => {
          udb.dropTable(done)
        },
        (done) => {
          udb.createTable(done)
        }
      ).run(done)
    })
    it('should work', done => {
      waterfall(
        (done) => {
          udb.findUserById(1, (err, user) => {
            expect(err).toBeFalsy()
            expect(user?.id).toBeUndefined()
            done()
          })
        },
        (done) => {
          const user = newUser({ id: 1, name: 'Alice', home: 'Wonderland', email: 'alice@mail.com' })
          udb.insertUser(user, err => {
            expect(err).toBeFalsy()
            done()
          })
        },
        (done) => {
          udb.findUserById(1, (err, user) => {
            expect(err).toBeFalsy()
            expect(user?.id).toBe(1)
            done()
          })
        }
      ).run(done)
    })
  })

})
