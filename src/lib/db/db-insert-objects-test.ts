import { Config, loadConfig } from '../../app/config/config.js'
import { DB } from './db.js'
import { waterfall } from '../base/async2.js'
import exp from 'constants'

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

  describe('insertObjects', () => {
    beforeEach(done => {
      waterfall(
        (done) => {
          db.query('drop table if exists table1', done)
        },
        (done) => {
          db.query('create table table1(id int, name varchar(16))', done)
        },
      ).run(done)
    })
    it('should work', done => {
      waterfall(
        (done) => {
          const objs = [
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Will' },
            { id: 3, name: 'Snow' },
          ]
          db.insertObjects('table1', objs, err => {
            expect(err).toBeFalsy()
            done()
          })
        },
        (done) => {
          db.query('select * from table1 order by id', (err, r) => {
            expect(err).toBeFalsy()
            expect(r.length).toBe(3)
            expect(r[0].id).toBe(1)
            expect(r[0].name).toBe('Alice')
            expect(r[1].id).toBe(2)
            expect(r[1].name).toBe('Will')
            expect(r[2].id).toBe(3)
            expect(r[2].name).toBe('Snow')
            done()
          })
        },
      ).run(done)
    })
    it('should stop at invalid object', done => {
      waterfall(
        (done) => {
          const objs = [
            { id: 1, name: 'Alice' },
            { id: 2, email: 'Will' },
            { id: 3, name: 'Snow' },
          ]
          db.insertObjects('table1', objs, err => {
            expect(err).toBeTruthy()
            done()
          })
        },
        (done) => {
          db.query('select * from table1 order by id', (err, r) => {
            expect(err).toBeFalsy()
            expect(r.length).toBe(1)
            expect(r[0].id).toBe(1)
            expect(r[0].name).toBe('Alice')
            done()
          })
        },
      ).run(done)
    })
  })

})
