'use strict';

const assert = require('assert');
const init = require('../base/init');
const error = require('../base/error');
const config = require('../base/config');
const date2 = require('../base/date2');
const my2 = require('../mysql/my2');
const expb = require('../express/express-base');
const counterb = require('../counter/counter-base');

before(function (done) {
  config.path = 'config/raysoda-test.json';
  my2.dropDatabase = true;
  init.run(done);
});

before((done) => {
  expb.start();
  done();
});

describe('counterb.counters', function () {
  it('should exist', function () {
    assert.notStrictEqual(counterb.counters, undefined);
  });
});

describe('.update(id)', function () {
  it('should succeed for new', function (done) {
    counterb.update('nodate', function (err) {
      assert.ifError(err);
      counterb.counters.findOne({ id: 'nodate' }, function (err, c) {
        assert.ifError(err);
        assert.strictEqual(c.id, 'nodate');
        assert.strictEqual(c.d, undefined);
        assert.strictEqual(c.c, 1);
        done();
      });
    });
  });
  it('should succeed for existing', function (done) {
    counterb.update('nodate', function (err) {
      assert.ifError(err);
      counterb.counters.findOne({ id: 'nodate' }, function (err, c) {
        assert.ifError(err);
        assert.strictEqual(c.id, 'nodate');
        assert.strictEqual(c.d, undefined);
        assert.strictEqual(c.c, 2);
        done();
      });
    });
  });
});

describe('.update(id, date)', function () {
  var today = date2.today();
  it('should succeed for new', function (done) {
    counterb.update('today', today, function (err) {
      assert.ifError(err);
      counterb.counters.findOne({ id: 'today', d: today }, function (err, c) {
        assert.ifError(err);
        assert.strictEqual(c.id, 'today');
        assert.deepStrictEqual(c.d, today);
        assert.strictEqual(c.c, 1);
        done();
      });
    });
  });
  it('should succeed for existing', function (done) {
    counterb.update('today', today, function (err) {
      assert.ifError(err);
      counterb.counters.findOne({ id: 'today', d: today }, function (err, c) {
        assert.ifError(err);
        assert.strictEqual(c.id, 'today');
        assert.deepStrictEqual(c.d, today);
        assert.strictEqual(c.c, 2);
        done();
      });
    });
  });
});
