import { Config, loadConfig } from '../config/config.js'
import { DBConn } from './db-conn.js'
import { DBKeyValue } from './db-keyvalue.js'
import { Done, waterfall } from '../../lib/base/async2.js'

describe('DBKeyValue', () => {

  let config: Config
  let conn: DBConn
  let kv: DBKeyValue

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
      done
    )
  })

  afterAll(done => {
    conn.close(done)
  })

  describe('persist table', () => {
    it('should exist', done => {
      conn.tableExists('persist', (err, exist) => {
        expect(err).toBeFalsy()
        expect(exist).toBe(true)
        done()
      })
    })
  })

  describe('updateKeyValue/findKeyValue', () => {
    it('should work with string', done => {
      waterfall(
        (done: Done) => {
          kv.updateKeyValue('s1', 'value1', err => {
            expect(err).toBeFalsy()
            done()
          })
        },
        (done: Done) => {
          kv.findKeyValue('s1', (err, value) => {
            expect(err).toBeFalsy()
            expect(value).toBe('value1')
            done()
          })
        },
        (done: Done) => {
          kv.updateKeyValue('s1', 'value2', err => {
            expect(err).toBeFalsy()
            done()
          })
        },
        (done: Done) => {
          kv.findKeyValue('s1', (err, value) => {
            expect(err).toBeFalsy()
            expect(value).toBe('value2')
            done()
          })
        },
        done
      )
    })
    it('should work with number', done => {
      waterfall(
        (done: Done) => {
          kv.updateKeyValue('n1', 123, function (err) {
            expect(err).toBeFalsy()
            done()
          })
        },
        (done: Done) => {
          kv.findKeyValue('n1', function (err, value) {
            expect(err).toBeFalsy()
            expect(value).toBe(123)
            done()
          })
        },
        done
      )
    })
    it('should work with object', done => {
      waterfall(
        (done: Done) => {
          kv.updateKeyValue('o1', { p1: 123, p2: 456 }, function (err) {
            expect(err).toBeFalsy()
            done()
          })
        },
        (done: Done) => {
          kv.findKeyValue('o1', function (err, value) {
            expect(err).toBeFalsy()
            expect(value).toEqual({ p1: 123, p2: 456 })
            done()
          })
        },
        done
      )
    })
    it('should return null for undefined', done => {
      kv.findKeyValue('noname', function (err, value) {
        expect(err).toBeFalsy()
        expect(value).toBe(null)
        done()
      })
    })
  })

})
