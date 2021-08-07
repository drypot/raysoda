import { Config, loadConfig } from '../config/config.js'
import { DBConn } from './db-conn.js'
import { Done, waterfall } from '../../lib/base/async2.js'

describe('DBConn', () => {

  let config: Config
  let db: DBConn

  beforeAll(done => {
    config = loadConfig('config/app-test.json')
    db = new DBConn(config)
    waterfall(
      (done: Done) => {
        db.dropDatabase(done)
      },
      (done: Done) => {
        db.createDatabase(done)
      },
      done
    )
  })

  afterAll(done => {
    db.close(done)
  })

  beforeAll(done => {
    db.conn.query('create table table1(id int)', done)
  })

  describe('runQueries', () => {
    it('should work', done => {
      waterfall(
        (done: Done) => {
          db.conn.query('truncate table table1', done)
        },
        (done: Done) => {
          const qa = [
            'insert into table1 values(1)',
            'insert into table1 values(2)',
            'insert into table1 values(3)',
            'insert into table1 values(4)',
            'insert into table1 values(5)'
          ]
          db.runQueries(qa, err => {
            expect(err).toBeFalsy()
            done()
          })
        },
        (done: Done) => {
          db.conn.query('select * from table1 where id = 1', (err, r) => {
            expect(err).toBeFalsy()
            expect(r[0].id).toBe(1)
            done()
          })
        },
        (done: Done) => {
          db.conn.query('select * from table1 where id = 5', (err, r) => {
            expect(err).toBeFalsy()
            expect(r[0].id).toBe(5)
            done()
          })
        },
        (done: Done) => {
          db.conn.query('select * from table1 where id = 6', (err, r) => {
            expect(err).toBeFalsy()
            expect(r[0]).toBeUndefined()
            done()
          })
        },
        done
      )
    })
    it('should stop at invalid script', done => {
      waterfall(
        (done: Done) => {
          db.conn.query('truncate table table1', done)
        },
        (done: Done) => {
          const qa = [
            'insert into table1 values(1)',
            'insert into table1 values(2)',
            'insert into xxx_t values(3)',
            'insert into table1 values(4)',
            'insert into table1 values(5)'
          ]
          db.runQueries(qa, err => {
            expect(err).toBeTruthy()
            expect(err.message).toMatch('xxx_t')
            done()
          })
        },
        (done: Done) => {
          db.conn.query('select * from table1 where id = 1', (err, r) => {
            expect(err).toBeFalsy()
            expect(r[0].id).toBe(1)
            done()
          })
        },
        (done: Done) => {
          db.conn.query('select * from table1 where id = 4', (err, r) => {
            expect(err).toBeFalsy()
            expect(r[0]).toBeUndefined()
            done()
          })
        },
        done
      )
    })
  })
})
