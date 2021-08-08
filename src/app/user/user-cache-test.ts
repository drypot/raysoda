import { Config, loadConfig } from '../config/config.js'
import { DB } from '../../lib/db/db.js'
import { UserDB } from './db/user-db.js'
import { UserCache } from './user-cache.js'
import { waterfall } from '../../lib/base/async2.js'
import { newUser } from './domain/user-domain.js'

describe('UserCache', () => {

  let config: Config
  let db: DB
  let udb: UserDB
  let uc: UserCache

  beforeAll(done => {
    config = loadConfig('config/app-test.json')
    db = new DB(config)
    udb = new UserDB(db)
    uc = new UserCache(udb)
    db.createDatabase(done)
  })

  afterAll(done => {
    db.close(done)
  })

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

  describe('getCached', () => {
    beforeAll(() => {
      uc.resetCache()
    })
    it('should work', done => {
      waterfall(
        (done) => {
          expect(uc.getStrictlyCached(1)).toBeUndefined()
          done()
        },
        (done) => {
          uc.getCached(1, (err, user) => {
            expect(err).toBeFalsy()
            expect(user?.id).toBe(1)
            done()
          })
        },
        (done) => {
          expect(uc.getStrictlyCached(1)).toBeDefined()
          done()
        }
      ).run(done)
    })
  })

  describe('getCachedByHome', () => {
    beforeAll(() => {
      uc.resetCache()
    })
    it('should work', done => {
      waterfall(
        (done) => {
          expect(uc.getStrictlyCachedByHome('Wonderland')).toBeUndefined()
          done()
        },
        (done) => {
          uc.getCachedByHome('Wonderland', (err, user) => {
            expect(err).toBeFalsy()
            expect(user?.id).toBe(1)
            done()
          })
        },
        (done) => {
          expect(uc.getStrictlyCachedByHome('Wonderland')).toBeDefined()
          done()
        }
      ).run(done)
    })
  })

  describe('deleteCache', () => {
    beforeAll(() => {
      uc.resetCache()
    })
    it('should work', done => {
      waterfall(
        (done) => {
          uc.getCached(1, (err, user) => {
            expect(err).toBeFalsy()
            expect(user?.id).toBe(1)
            done()
          })
        },
        (done) => {
          expect(uc.getStrictlyCached(1)).toBeDefined()
          done()
        },
        (done) => {
          uc.deleteCache(1)
          done()
        },
        (done) => {
          expect(uc.getStrictlyCached(1)).toBeUndefined()
          done()
        },
      ).run(done)
    })
  })
})
