import { Config, loadConfig } from '../config/config.js'
import { DBConn } from '../db/db-conn.js'
import { DBKeyValue } from '../db/db-keyvalue.js'
import { Done, waterfall } from '../../lib/base/async2.js'
import { UserDB } from './user-db.js'

describe('UserDB', () => {

  let config: Config
  let conn: DBConn
  let kv: DBKeyValue
  let userdb: UserDB

  beforeAll(done => {
    config = loadConfig('config/app-test.json')
    conn = new DBConn(config)
    waterfall(
      (done: Done) => {
        conn.dropDatabase(done)
      },
      (done: Done) => {
        conn.createDatabase(done)
      },
      (done: Done) => {
        kv = new DBKeyValue(conn)
        kv.createTable(done)
      },
      (done: Done) => {
        userdb = new UserDB(conn)
        userdb.createTable(done)
      },
      done
    )
  })

  afterAll(done => {
    conn.close(done)
  })

  describe('table user', () => {
    it('should exist', done => {
      conn.tableExists('user', (err, exist) => {
        expect(err).toBeFalsy()
        expect(exist).toBe(true)
        done()
      })
    })
  })

  describe('getNewId', () => {
    it('should work', () => {
      expect(userdb.getNewId()).toBe(1)
      expect(userdb.getNewId()).toBe(2)
      expect(userdb.getNewId()).toBe(3)
    })
  })

})
