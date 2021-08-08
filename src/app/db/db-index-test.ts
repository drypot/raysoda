import { Config, loadConfig } from '../config/config.js'
import { DB } from './db.js'
import { waterfall } from '../../lib/base/async2.js'

describe('DBConn', () => {

  let config: Config
  let db: DB

  beforeAll(done => {
    config = loadConfig('config/app-test.json')
    db = new DB(config)
    db.createDatabase(done)
  })

  afterAll(done => {
    db.close(done)
  })

  describe('findIndex', () => {
    it('should work', done => {
      waterfall(
        (done) => {
          db.query('drop table if exists user1', done)
        },
        (done) => {
          db.query('create table user1(id int, email varchar(64), primary key (id))', done)
        },
        (done) => {
          db.findIndex('user1', 'email', (err, r) => {
            expect(err).toBeFalsy()
            expect(r.length).toBe(0)
            done()
          })
        },
        (done) => {
          db.query('create index email on user1(email)', done)
        },
        (done) => {
          db.findIndex('user1', 'email', (err, r) => {
            expect(err).toBeFalsy()
            expect(r.length).toBe(1)
            done()
          })
        },
      ).run(done)
    })
  })

  describe('createIndexIfNotExists', () => {
    it('should work', done => {
      waterfall(
        (done) => {
          db.query('drop table if exists user1', done)
        },
        (done) => {
          db.query('create table user1(id int, email varchar(64), primary key (id))', done)
        },
        (done) => {
          db.findIndex('user1', 'email', (err, r) => {
            expect(err).toBeFalsy()
            expect(r.length).toBe(0)
            done()
          })
        },
        (done) => {
          db.createIndexIfNotExists('create index email on user1(email)', (err) => {
            expect(err).toBeFalsy()
            done()
          })
        },
        (done) => {
          db.findIndex('user1', 'email', (err, r) => {
            expect(err).toBeFalsy()
            expect(r.length).toBe(1)
            done()
          })
        },
        (done) => {
          db.createIndexIfNotExists('create index email on user1(email)', (err) => {
            expect(err).toBeFalsy()
            done()
          })
        },
        (done) => {
          db.findIndex('user1', 'email', (err, r) => {
            expect(err).toBeFalsy()
            expect(r.length).toBe(1)
            done()
          })
        },
      ).run(done)
    })
  })

})
