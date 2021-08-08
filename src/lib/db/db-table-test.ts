import { Config, loadConfig } from '../../app/config/config.js'
import { DB } from './db.js'
import { waterfall } from '../base/async2.js'

describe('DB', () => {

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

  describe('findTable', () => {
    it('should work', done => {
      waterfall(
        (done) => {
          db.query('drop table if exists table1', done)
        },
        (done) => {
          db.query('create table table1(id int)', done)
        },
        (done) => {
          db.findTable('table1', (err, r) => {
            expect(err).toBeFalsy()
            expect(r.length).toBe(1)
            done()
          })
        },
      ).run(done)
    })
    it('should work when table not exist', done => {
      waterfall(
        (done) => {
          db.query('drop table if exists table1', done)
        },
        (done) => {
          db.findTable('table1', (err, r) => {
            expect(err).toBeFalsy()
            expect(r.length).toBe(0)
            done()
          })
        },
      ).run(done)
    })
  })

  describe('getMaxId', () => {
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
          const values = [[1], [2], [3]]
          db.query('insert into table1 values ?', [values], done)
        },
        (done) => {
          db.getMaxId('table1', (err, maxId) => {
            expect(err).toBeFalsy()
            expect(maxId).toBe(3)
            done()
          })
        },
        (done) => {
          db.getMaxId('table2', (err, maxId) => {
            expect(err).toBeTruthy()
            done()
          })
        },
      ).run(done)
    })
  })

})
