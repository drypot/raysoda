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

  describe('findTable', () => {
    it('should work', done => {
      waterfall(
        (done: Done) => {
          db.findTable('table1', (err, r) => {
            expect(err).toBeFalsy()
            expect(r[0]).toBeUndefined()
            done()
          })
        },
        (done: Done) => {
          db.query('create table table1(id int)', done)
        },
        (done: Done) => {
          db.findTable('table1', (err, r) => {
            expect(err).toBeFalsy()
            expect(r[0]).toBeDefined()
            done()
          })
        },
        done
      )
    })
  })

  describe('getMaxId', () => {
    it('should work', done => {
      waterfall(
        (done: Done) => {
          db.getMaxId('table2', (err, maxId) => {
            expect(err).toBeTruthy()
            done()
          })
        },
        (done: Done) => {
          db.query('create table table2(id int)', done)
        },
        (done: Done) => {
          const values = [[1], [2], [3]]
          db.query('insert into table2 values ?', [values], done)
        },
        (done: Done) => {
          db.getMaxId('table2', (err, maxId) => {
            expect(err).toBeFalsy()
            expect(maxId).toBe(3)
            done()
          })
        },
        done
      )
    })
  })

})
