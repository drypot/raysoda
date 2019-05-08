'use strict';

const init = require('../base/init');
const error = require('../base/error');
const config = require('../base/config');
const date2 = require('../base/date2');
const mongo2 = require('../mongo/mongo2');
const expb = require('../express/express-base');
const counterb = require('../counter/counter-base');
const assert = require('assert');
const assert2 = require('../base/assert2');

before(function (done) {
  config.path = 'config/test.json';
  mongo2.dropDatabase = true;
  init.run(done);
});

before((done) => {
  expb.start();
  done();
});

describe('counterb.counters', function () {
  it('should exist', function () {
    assert2.ne(counterb.counters, undefined);
  });
});

describe('.update(id)', function () {
  it('should succeed for new', function (done) {
    counterb.update('nodate', function (err) {
      assert.ifError(err);
      counterb.counters.findOne({ id: 'nodate' }, function (err, c) {
        assert.ifError(err);
        assert2.e(c.id, 'nodate');
        assert2.e(c.d, undefined);
        assert2.e(c.c, 1);
        done();
      });
    });
  });
  it('should succeed for existing', function (done) {
    counterb.update('nodate', function (err) {
      assert.ifError(err);
      counterb.counters.findOne({ id: 'nodate' }, function (err, c) {
        assert.ifError(err);
        assert2.e(c.id, 'nodate');
        assert2.e(c.d, undefined);
        assert2.e(c.c, 2);
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
        assert2.e(c.id, 'today');
        assert2.de(c.d, today);
        assert2.e(c.c, 1);
        done();
      });
    });
  });
  it('should succeed for existing', function (done) {
    counterb.update('today', today, function (err) {
      assert.ifError(err);
      counterb.counters.findOne({ id: 'today', d: today }, function (err, c) {
        assert.ifError(err);
        assert2.e(c.id, 'today');
        assert2.de(c.d, today);
        assert2.e(c.c, 2);
        done();
      });
    });
  });
});
