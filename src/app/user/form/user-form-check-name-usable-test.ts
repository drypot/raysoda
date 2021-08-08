import { Config, loadConfig } from '../../config/config.js'
import { DB } from '../../../lib/db/db.js'
import { waterfall } from '../../../lib/base/async2.js'
import { newUser } from '../domain/user-domain.js'
import { UserDB } from '../db/user-db.js'
import { checkUserNameUsable, NAME_DUPE } from './user-form.js'
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

  describe('checkUserNameUsable', () => {
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
    it('should pass when name is not in use', done => {
      const errs: FormError[] = []
      checkUserNameUsable(udb, 0, 'New World', errs, (err) => {
        expect(err).toBeFalsy()
        expect(errs.length).toBe(0)
        done()
      })
    })
    it('should fail when name is in use for name', done => {
      const errs: FormError[] = []
      checkUserNameUsable(udb, 0, 'alice', errs, (err) => {
        expect(err).toBeFalsy()
        expect(errs).toContain(NAME_DUPE)
        done()
      })
    })
    it('should fail when name is in use for home', done => {
      const errs: FormError[] = []
      checkUserNameUsable(udb, 0, 'wonderland', errs, (err) => {
        expect(err).toBeFalsy()
        expect(errs).toContain(NAME_DUPE)
        done()
      })
    })
    it('should pass when name is my name', done => {
      const errs: FormError[] = []
      checkUserNameUsable(udb, 1, 'alice', errs, (err) => {
        expect(err).toBeFalsy()
        expect(errs.length).toBe(0)
        done()
      })
    })
    it('should pass when name is my home', done => {
      const errs: FormError[] = []
      checkUserNameUsable(udb, 1, 'wonderland', errs, (err) => {
        expect(err).toBeFalsy()
        expect(errs.length).toBe(0)
        done()
      })
    })
  })


})
