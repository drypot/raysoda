import { Config, loadConfig } from '../../app/config/config.js'
import { DB } from './db.js'
import { ValueDB } from './value-db.js'
import { waterfall } from '../base/async2.js'

describe('ValueDB', () => {

  let config: Config
  let db: DB
  let vdb: ValueDB

  beforeAll(done => {
    config = loadConfig('config/app-test.json')
    db = new DB(config)
    vdb = new ValueDB(db)
    db.createDatabase(done)
  })

  afterAll(done => {
    db.close(done)
  })

  describe('createTable', () => {
    it('should work', done => {
      waterfall(
        (done) => {
          vdb.dropTable(done)
        },
        (done) => {
          vdb.createTable(done)
        },
        (done) => {
          db.findTable('persist', (err, r) => {
            expect(err).toBeFalsy()
            expect(r.length).toBe(1)
            done()
          })
        },
      ).run(done)
    })
  })

  describe('dropTable', () => {
    it('should work', done => {
      waterfall(
        (done) => {
          vdb.createTable(done)
        },
        (done) => {
          vdb.dropTable(done)
        },
        (done) => {
          db.findTable('persist', (err, r) => {
            expect(err).toBeFalsy()
            expect(r.length).toBe(0)
            done()
          })
        },
      ).run(done)
    })
  })

  describe('updateKeyValue/findKeyValue', () => {
    beforeAll(done => {
      waterfall(
        (done) => {
          vdb.dropTable(done)
        },
        (done) => {
          vdb.createTable(done)
        }
      ).run(done)
    })
    it('should work with string', done => {
      waterfall(
        (done) => {
          vdb.updateValue('s1', 'value1', err => {
            expect(err).toBeFalsy()
            done()
          })
        },
        (done) => {
          vdb.findValue('s1', (err, value) => {
            expect(err).toBeFalsy()
            expect(value).toBe('value1')
            done()
          })
        },
        (done) => {
          vdb.updateValue('s1', 'value2', err => {
            expect(err).toBeFalsy()
            done()
          })
        },
        (done) => {
          vdb.findValue('s1', (err, value) => {
            expect(err).toBeFalsy()
            expect(value).toBe('value2')
            done()
          })
        }
      ).run(done)
    })
    it('should work with empty string', done => {
      waterfall(
        (done) => {
          vdb.updateValue('empty', '', err => {
            expect(err).toBeFalsy()
            done()
          })
        },
        (done) => {
          vdb.findValue('empty', (err, value) => {
            expect(err).toBeFalsy()
            expect(value).toBe('')
            done()
          })
        }
      ).run(done)
    })
    it('should work with number', done => {
      waterfall(
        (done) => {
          vdb.updateValue('n1', 123, function (err) {
            expect(err).toBeFalsy()
            done()
          })
        },
        (done) => {
          vdb.findValue('n1', function (err, value) {
            expect(err).toBeFalsy()
            expect(value).toBe(123)
            done()
          })
        }
      ).run(done)
    })
    it('should work with 0', done => {
      waterfall(
        (done) => {
          vdb.updateValue('zero', 0, function (err) {
            expect(err).toBeFalsy()
            done()
          })
        },
        (done) => {
          vdb.findValue('zero', function (err, value) {
            expect(err).toBeFalsy()
            expect(value).toBe(0)
            done()
          })
        }
      ).run(done)
    })
    it('should work with object', done => {
      waterfall(
        (done) => {
          vdb.updateValue('o1', { p1: 123, p2: 456 }, function (err) {
            expect(err).toBeFalsy()
            done()
          })
        },
        (done) => {
          vdb.findValue('o1', function (err, value) {
            expect(err).toBeFalsy()
            expect(value).toEqual({ p1: 123, p2: 456 })
            done()
          })
        }
      ).run(done)
    })
    it('should work with empty object', done => {
      waterfall(
        (done) => {
          vdb.updateValue('emptyObj', {}, function (err) {
            expect(err).toBeFalsy()
            done()
          })
        },
        (done) => {
          vdb.findValue('emptyObj', function (err, value) {
            expect(err).toBeFalsy()
            expect(value).toEqual({})
            done()
          })
        }
      ).run(done)
    })
    it('should work with null', done => {
      waterfall(
        (done) => {
          vdb.updateValue('null', null, function (err) {
            expect(err).toBeFalsy()
            done()
          })
        },
        (done) => {
          vdb.findValue('null', function (err, value) {
            expect(err).toBeFalsy()
            expect(value).toEqual(null)
            done()
          })
        }
      ).run(done)
    })
    it('can return undefined', done => {
      vdb.findValue('noname', function (err, value) {
        expect(err).toBeFalsy()
        expect(value).toBeUndefined()
        done()
      })
    })
  })

})
