import * as assert2 from "../base/assert2.mjs";
import * as config from "../base/config.mjs";
import * as init from "../base/init.mjs";
import * as db from "../db/db.mjs";
import * as dbPersist from "./db-persist.mjs";

before(function (done) {
  config.setPath('config/test.json');
  db.setDropDatabase(true);
  init.run(done);
});

describe('table persist', function () {
  it('should exist', function (done) {
    db.tableExists('persist', (err, exist) => {
      assert2.ifError(err);
      assert2.ok(exist);
      done();
    });
  });
});

describe('persist', function () {
  describe('.update(id, string)', function () {
    it('should succeed', function (done) {
      dbPersist.update('s1', 'value1', function (err) {
        assert2.ifError(err);
        dbPersist.find('s1', function (err, value) {
          assert2.ifError(err);
          assert2.e(value, 'value1');
          done();
        });
      });
    });
    it('should succeed on replace', function (done) {
      dbPersist.update('s1', 'value2', function (err) {
        assert2.ifError(err);
        dbPersist.find('s1', function (err, value) {
          assert2.ifError(err);
          assert2.e(value, 'value2');
          done();
        });
      });
    });
  });
  describe('update(id, number)', function () {
    it('should succeed', function (done) {
      dbPersist.update('n1', 123, function (err) {
        assert2.ifError(err);
        dbPersist.find('n1', function (err, value) {
          assert2.ifError(err);
          assert2.e(value, 123);
          done();
        });
      });
    });
  });
  describe('update(id, obj)', function () {
    it('should succeed', function (done) {
      dbPersist.update('o1', { p1: 123, p2: 456 }, function (err) {
        assert2.ifError(err);
        dbPersist.find('o1', function (err, value) {
          assert2.ifError(err);
          assert2.de(value, { p1: 123, p2: 456 });
          done();
        });
      });
    });
  });
  describe('find()', function () {
    it('should return null for undefined', function (done) {
      dbPersist.find('noname', function (err, value) {
        assert2.ifError(err);
        assert2.e(value, null);
        done();
      });
    });
  });
});
