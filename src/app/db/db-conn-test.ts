import { Config, loadConfig } from '../config/config.js'
import { DBConn } from './db-conn.js'
import { ifError } from 'assert'
import { Done, waterfall } from '../../lib/base/async2.js'
import { DBKeyValue } from './db-keyvalue.js'

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
      conn.dropDatabase(err => {
        expect(err).toBeFalsy()
        conn.dbExists(config.mysqlDatabase, (err, exist) => {
          expect(err).toBeFalsy()
          expect(exist).toBe(false)
          conn.createDatabase(err => {
            expect(err).toBeFalsy()
            conn.dbExists(config.mysqlDatabase, (err, exist) => {
              expect(err).toBeFalsy()
              expect(exist).toBe(true)
              done()
            })
          })
        })
      })
    })
  })

  describe('tableExists', () => {
    beforeAll((done) => {
      conn.query('create table table_exist(id int)', done)
    })
    it('should work when table exist', done => {
      conn.tableExists('table_exist', (err, exist) => {
        expect(err).toBeFalsy()
        expect(exist).toBe(true)
        done()
      })
    })
    it('should work when table not exist', done => {
      conn.tableExists('table_non_exist', (err, exist) => {
        expect(err).toBeFalsy()
        expect(exist).toBe(false)
        done()
      })
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

})
