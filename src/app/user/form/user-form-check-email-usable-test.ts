import { Config, loadConfig } from '../../config/config.js'
import { DB } from '../../../lib/db/db.js'
import { waterfall } from '../../../lib/base/async2.js'
import { newUser } from '../domain/user-domain.js'
import { UserDB } from '../db/user-db.js'
import { checkUserEmailUsable, EMAIL_DUPE } from './user-form.js'
import { FormError } from '../../../lib/base/error2.js'

describe('UserForm', () => {

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

  describe('checkUserEmailUsable', () => {
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
      const errs: FormError[] = []
      checkUserEmailUsable(udb, 0, 'snow@mail.com', errs, (err) => {
        expect(err).toBeFalsy()
        expect(errs.length).toBe(0)
        done()
      })
    })
    it('should fail when email is in use', done => {
      const errs: FormError[] = []
      checkUserEmailUsable(udb, 0, 'alice@mail.com', errs, (err) => {
        expect(err).toBeFalsy()
        expect(errs).toContain(EMAIL_DUPE)
        done()
      })
    })
    it('should pass when email is mine', done => {
      const errs: FormError[] = []
      checkUserEmailUsable(udb, 1, 'alice@mail.com', errs, (err) => {
        expect(err).toBeFalsy()
        expect(errs.length).toBe(0)
        done()
      })
    })
  })

})
