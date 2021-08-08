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

  describe('findUserById', () => {
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
    it('should work', done => {
      waterfall(
        (done) => {
          udb.findUserById(1, (err, user) => {
            expect(err).toBeFalsy()
            expect(user?.id).toBe(1)
            done()
          })
        },
        (done) => {
          udb.findUserById(999, (err, user) => {
            expect(err).toBeFalsy()
            expect(user?.id).toBeUndefined()
            done()
          })
        }
      ).run(done)
    })
  })

  describe('findUserByEmail', () => {
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
    it('should work', done => {
      waterfall(
        (done) => {
          udb.findUserByEmail('alice@mail.com', (err, user) => {
            expect(err).toBeFalsy()
            expect(user?.id).toBe(1)
            done()
          })
        },
        (done) => {
          udb.findUserByEmail('Alice@mail.com', (err, user) => {
            expect(err).toBeFalsy()
            expect(user?.id).toBe(1)
            done()
          })
        },
        (done) => {
          udb.findUserByEmail('xxx@mail.com', (err, user) => {
            expect(err).toBeFalsy()
            expect(user?.id).toBeUndefined()
            done()
          })
        }
      ).run(done)
    })
  })

  describe('findUserByHome', () => {
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
    it('should work', done => {
      waterfall(
        (done) => {
          udb.findUserByHome('Wonderland', (err, user) => {
            expect(err).toBeFalsy()
            expect(user?.id).toBe(1)
            done()
          })
        },
        (done) => {
          udb.findUserByHome('wonderland', (err, user) => {
            expect(err).toBeFalsy()
            expect(user?.id).toBe(1)
            done()
          })
        },
        (done) => {
          udb.findUserByHome('Neverland', (err, user) => {
            expect(err).toBeFalsy()
            expect(user?.id).toBeUndefined()
            done()
          })
        }
      ).run(done)
    })
  })

})
