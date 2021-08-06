import { Config, loadConfig } from '../config/config.js'
import { DBConn } from './db-conn.js'
import { ifError } from 'assert'
import { Done, waterfall } from '../../lib/base/async2.js'
import { DBKeyValue } from './db-keyvalue.js'
import exp from 'constants'

describe('DBConn', () => {

  let config: Config
  let conn: DBConn

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
      done
    )
  })

  describe('dropDatabase/createDatabase/dbExists', () => {
    it('should work', done => {
      waterfall(
        (done: Done) => {
          conn.dropDatabase(err => {
            expect(err).toBeFalsy()
            done()
          })
        },
        (done: Done) => {
          conn.dbExists(config.mysqlDatabase, (err, exist) => {
            expect(err).toBeFalsy()
            expect(exist).toBe(false)
            done()
          })
        },
        (done: Done) => {
          conn.createDatabase(err => {
            expect(err).toBeFalsy()
            done()
          })
        },
        (done: Done) => {
          conn.dbExists(config.mysqlDatabase, (err, exist) => {
            expect(err).toBeFalsy()
            expect(exist).toBe(true)
            done()
          })
        },
        done
      )
    })
  })

  describe('tableExists', () => {
    it('should work', done => {
      waterfall(
        (done: Done) => {
          conn.tableExists('exist_test_t', (err, exist) => {
            expect(err).toBeFalsy()
            expect(exist).toBe(false)
            done()
          })
        },
        (done: Done) => {
          conn.query('create table exist_test_t(id int)', done)
        },
        (done: Done) => {
          conn.tableExists('exist_test_t', (err, exist) => {
            expect(err).toBeFalsy()
            expect(exist).toBe(true)
            done()
          })
        },
        done
      )
    })
  })

  describe('query', () => {
    it('should work when result exists.', done => {
      conn.query('select * from (select 1 as id) dummy where id = 1', (err: any, r: any) => {
        expect(err).toBeFalsy()
        expect(r[0].id).toBe(1)
        done()
      })
    })
    it('should work when result does not exists.', done => {
      conn.query('select * from (select 1 as id) dummy where id = 2', (err, r) => {
        expect(err).toBeFalsy()
        expect(r[0]).toBe(undefined)
        done()
      })
    })
  })

  describe('queryOne', () => {
    it('should work when result exists.', done => {
      conn.queryOne('select * from (select 1 as id) dummy where id = 1', (err: any, r: any) => {
        expect(err).toBeFalsy()
        expect(r.id).toBe(1)
        done()
      })
    })
    it('should work when result does not exists.', done => {
      conn.queryOne('select * from (select 1 as id) dummy where id = 2', (err, r) => {
        expect(err).toBeFalsy()
        expect(r).toBe(undefined)
        done()
      })
    })
  })

  describe('runQueries', () => {
    beforeAll(done => {
      conn.query('create table runq_test_t(id int)', done)
    })
    it('should work', done => {
      waterfall(
        (done: Done) => {
          const qa = [
            'insert into runq_test_t values(1)',
            'insert into runq_test_t values(2)',
            'insert into runq_test_t values(3)',
          ]
          conn.runQueries(qa, err => {
            expect(err).toBeFalsy()
            done()
          })
        },
        (done: Done) => {
          conn.queryOne('select * from runq_test_t where id = 1', (err, r) => {
            expect(err).toBeFalsy()
            expect(r.id).toBe(1)
            done()
          })
        },
        (done: Done) => {
          conn.queryOne('select * from runq_test_t where id = 3', (err, r) => {
            expect(err).toBeFalsy()
            expect(r.id).toBe(3)
            done()
          })
        },
        (done: Done) => {
          conn.queryOne('select * from runq_test_t where id = 4', (err, r) => {
            expect(err).toBeFalsy()
            expect(r).toBeUndefined()
            done()
          })
        },
        done
      )
    })
    it('should work', done => {
      waterfall(
        (done: Done) => {
          const qa = [
            'insert into runq_test_t values(11)',
            'insert into runq_test_t values(22)',
            'insert into xxx_t values(33)',
            'insert into runq_test_t values(44)',
            'insert into runq_test_t values(55)'
          ]
          conn.runQueries(qa, err => {
            expect(err).toBeTruthy()
            expect(err.message).toMatch('xxx_t')
            done()
          })
        },
        (done: Done) => {
          conn.queryOne('select * from runq_test_t where id = 11', (err, r) => {
            expect(err).toBeFalsy()
            expect(r.id).toBe(11)
            done()
          })
        },
        (done: Done) => {
          conn.queryOne('select * from runq_test_t where id = 44', (err, r) => {
            expect(err).toBeFalsy()
            expect(r).toBeUndefined()
            done()
          })
        },
        done
      )
    })
  })
})
