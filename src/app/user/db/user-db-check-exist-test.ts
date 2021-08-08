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

  describe('checkNameUsable', () => {
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
    it('should return true when name is mine', done => {
      udb.checkNameUsable(1, 'alice', (err, usable) => {
        expect(err).toBeFalsy()
        expect(usable).toBe(true)
        done()
      })
    })
    it('should return true when home is mine', done => {
      udb.checkNameUsable(1, 'wonderland', (err, usable) => {
        expect(err).toBeFalsy()
        expect(usable).toBe(true)
        done()
      })
    })
    it('should return false when name is others', done => {
      udb.checkNameUsable(2, 'alice', (err, usable) => {
        expect(err).toBeFalsy()
        expect(usable).toBe(false)
        done()
      })
    })
    it('should return false when home is others', done => {
      udb.checkNameUsable(2, 'wonderland', (err, usable) => {
        expect(err).toBeFalsy()
        expect(usable).toBe(false)
        done()
      })
    })
    it('should return true when name is not in use', done => {
      udb.checkNameUsable(2, 'New World', (err, usable) => {
        expect(err).toBeFalsy()
        expect(usable).toBe(true)
        done()
      })
    })
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
    it('should return true when email is mine', done => {
      udb.checkEmailUsable(1, 'alice@mail.com', (err, usable) => {
        expect(err).toBeFalsy()
        expect(usable).toBe(true)
        done()
      })
    })
    it('should return false when email is others', done => {
      udb.checkEmailUsable(2, 'alice@mail.com', (err, usable) => {
        expect(err).toBeFalsy()
        expect(usable).toBe(false)
        done()
      })
    })
    it('should return true when name is not in use', done => {
      udb.checkEmailUsable(2, 'snow@mail.com', (err, usable) => {
        expect(err).toBeFalsy()
        expect(usable).toBe(true)
        done()
      })
    })
  })

})
