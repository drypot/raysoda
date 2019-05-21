'use strict';

const assert = require('assert');
const init = require('../base/init');
const config = require('../base/config');
const my2 = require('../mysql/my2');
const persist = require('../mysql/persist');

before(function (done) {
  config.path = 'config/test.json';
  my2.dropDatabase = true;
  init.run(done);
});

describe('table persist', function () {
  it('should exist', function (done) {
    my2.tableExists('persist', (err, exist) => {
      assert.ifError(err);
      assert(exist);
      done();
    });
  });
});

describe('persist', function () {
  describe('.update(id, string)', function () {
    it('should succeed', function (done) {
      persist.update('s1', 'value1', function (err) {
        assert.ifError(err);
        persist.find('s1', function (err, value) {
          assert.ifError(err);
          assert.strictEqual(value, 'value1');
          done();
        });
      });
    });
    it('should succeed on replace', function (done) {
      persist.update('s1', 'value2', function (err) {
        assert.ifError(err);
        persist.find('s1', function (err, value) {
          assert.ifError(err);
          assert.strictEqual(value, 'value2');
          done();
        });
      });
    });
  });
  describe('.update(id, number)', function () {
    it('should succeed', function (done) {
      persist.update('n1', 123, function (err) {
        assert.ifError(err);
        persist.find('n1', function (err, value) {
          assert.ifError(err);
          assert.strictEqual(value, 123);
          done();
        });
      });
    });
  });
  describe('.update(id, obj)', function () {
    it('should succeed', function (done) {
      persist.update('o1', { p1: 123, p2: 456 }, function (err) {
        assert.ifError(err);
        persist.find('o1', function (err, value) {
          assert.ifError(err);
          assert.deepStrictEqual(value, { p1: 123, p2: 456 });
          done();
        });
      });
    });
  });
  describe('.find()', function () {
    it('should return null for undefined', function (done) {
      persist.find('noname', function (err, value) {
        assert.ifError(err);
        assert.strictEqual(value, null);
        done();
      });
    });
  });
});