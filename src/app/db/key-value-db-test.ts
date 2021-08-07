import { Config, loadConfig } from '../config/config.js'
import { DBConn } from './db-conn.js'
import { KeyValueDB } from './key-value-db.js'
import { Done, waterfall } from '../../lib/base/async2.js'

describe('KeyValueDB', () => {

  let config: Config
  let conn: DBConn
  let kv: KeyValueDB

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
        kv = new KeyValueDB(conn)
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
    it('should work with emtpy string', done => {
      waterfall(
        (done: Done) => {
          kv.updateKeyValue('empty', '', err => {
            expect(err).toBeFalsy()
            done()
          })
        },
        (done: Done) => {
          kv.findKeyValue('empty', (err, value) => {
            expect(err).toBeFalsy()
            expect(value).toBe('')
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
    it('should work with 0', done => {
      waterfall(
        (done: Done) => {
          kv.updateKeyValue('zero', 0, function (err) {
            expect(err).toBeFalsy()
            done()
          })
        },
        (done: Done) => {
          kv.findKeyValue('zero', function (err, value) {
            expect(err).toBeFalsy()
            expect(value).toBe(0)
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
    it('should work with empty object', done => {
      waterfall(
        (done: Done) => {
          kv.updateKeyValue('emptyObj', { }, function (err) {
            expect(err).toBeFalsy()
            done()
          })
        },
        (done: Done) => {
          kv.findKeyValue('emptyObj', function (err, value) {
            expect(err).toBeFalsy()
            expect(value).toEqual({ })
            done()
          })
        },
        done
      )
    })
    it('should work with null', done => {
      waterfall(
        (done: Done) => {
          kv.updateKeyValue('null', null, function (err) {
            expect(err).toBeFalsy()
            done()
          })
        },
        (done: Done) => {
          kv.findKeyValue('null', function (err, value) {
            expect(err).toBeFalsy()
            expect(value).toEqual(null)
            done()
          })
        },
        done
      )
    })
    it('can return undefined', done => {
      kv.findKeyValue('noname', function (err, value) {
        expect(err).toBeFalsy()
        expect(value).toBeUndefined()
        done()
      })
    })
  })

})
