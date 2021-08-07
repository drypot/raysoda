import { Config, loadConfig } from '../config/config.js'
import { DBConn } from './db-conn.js'

describe('DBConn', () => {

  let config: Config
  let db: DBConn

  beforeAll(done => {
    config = loadConfig('config/app-test.json')
    db = new DBConn(config)
    done()
  })

  afterAll(done => {
    db.close(done)
  })

  describe('query', () => {
    it('should work when result exists.', done => {
      db.query('select * from (select 1 as id) dummy where id = 1', (err: any, r: any) => {
        expect(err).toBeFalsy()
        expect(r[0].id).toBe(1)
        done()
      })
    })
    it('should work when result does not exists.', done => {
      db.query('select * from (select 1 as id) dummy where id = 2', (err, r) => {
        expect(err).toBeFalsy()
        expect(r[0]).toBe(undefined)
        done()
      })
    })
  })

})
