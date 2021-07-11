import * as config from "../base/config.mjs";
import * as init from "../base/init.mjs";
import * as db from "../db/db.mjs";
import * as dbPersist from "./db-persist.mjs";

beforeAll(done => {
  config.setPath('config/test.json');
  db.setDropDatabase(true);
  init.run(done);
});

describe('table persist', () => {
  it('should exist', done => {
    db.tableExists('persist', (err, exist) => {
      expect(err).toBeFalsy();
      assert2.ok(exist);
      done();
    });
  });
});

describe('persist', () => {
  describe('.update(id, string)', () => {
    it('should succeed', done => {
      dbPersist.update('s1', 'value1', function (err) {
        expect(err).toBeFalsy();
        dbPersist.find('s1', function (err, value) {
          expect(err).toBeFalsy();
          expect(value).toBe('value1');
          done();
        });
      });
    });
    it('should succeed on replace', done => {
      dbPersist.update('s1', 'value2', function (err) {
        expect(err).toBeFalsy();
        dbPersist.find('s1', function (err, value) {
          expect(err).toBeFalsy();
          expect(value).toBe('value2');
          done();
        });
      });
    });
  });
  describe('update(id, number)', () => {
    it('should succeed', done => {
      dbPersist.update('n1', 123, function (err) {
        expect(err).toBeFalsy();
        dbPersist.find('n1', function (err, value) {
          expect(err).toBeFalsy();
          expect(value).toBe(123);
          done();
        });
      });
    });
  });
  describe('update(id, obj)', () => {
    it('should succeed', done => {
      dbPersist.update('o1', { p1: 123, p2: 456 }, function (err) {
        expect(err).toBeFalsy();
        dbPersist.find('o1', function (err, value) {
          expect(err).toBeFalsy();
          assert2.de(value, { p1: 123, p2: 456 });
          done();
        });
      });
    });
  });
  describe('find()', () => {
    it('should return null for undefined', done => {
      dbPersist.find('noname', function (err, value) {
        expect(err).toBeFalsy();
        expect(value).toBe(null);
        done();
      });
    });
  });
});
