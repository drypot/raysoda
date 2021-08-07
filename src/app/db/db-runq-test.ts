import { Config, loadConfig } from '../config/config.js'
import { DB } from './db.js'
import { waterfall } from '../../lib/base/async2.js'

describe('DBConn', () => {

  let config: Config
  let db: DB

  beforeAll(done => {
    config = loadConfig('config/app-test.json')
    db = new DB(config)
    waterfall(
      (done) => {
        db.dropDatabase(done)
      },
      (done) => {
        db.createDatabase(done)
      }
    ).run(done)
  })

  afterAll(done => {
    db.close(done)
  })

  describe('runQueries', () => {
    beforeEach(done => {
      waterfall(
        (done) => {
          db.query('drop table if exists table1', done)
        },
        (done) => {
          db.query('create table table1(id int)', done)
        },
      ).run(done)
    })
    it('should work', done => {
      waterfall(
        (done) => {
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
        (done) => {
          db.query('select * from table1 where id = 1', (err, r) => {
            expect(err).toBeFalsy()
            expect(r[0].id).toBe(1)
            done()
          })
        },
        (done) => {
          db.query('select * from table1 where id = 5', (err, r) => {
            expect(err).toBeFalsy()
            expect(r[0].id).toBe(5)
            done()
          })
        },
        (done) => {
          db.query('select * from table1 where id = 6', (err, r) => {
            expect(err).toBeFalsy()
            expect(r[0]).toBeUndefined()
            done()
          })
        }
      ).run(done)
    })
    it('should stop at invalid script', done => {
      waterfall(
        (done) => {
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
        (done) => {
          db.query('select * from table1 where id = 1', (err, r) => {
            expect(err).toBeFalsy()
            expect(r[0].id).toBe(1)
            done()
          })
        },
        (done) => {
          db.query('select * from table1 where id = 4', (err, r) => {
            expect(err).toBeFalsy()
            expect(r[0]).toBeUndefined()
            done()
          })
        }
      ).run(done)
    })
  })

})
