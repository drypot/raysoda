'use strict';

var init = require('../base/init');
var error = require('../base/error');
var config = require('../base/config')({ path: 'config/test.json' });
var mongo2 = require('../mongo/mongo2')({ dropDatabase: true });
var util2 = require('../base/util2');
var counterb = require('../counter/counter-base');
var assert = require('assert');
var assert2 = require('../base/assert2');

before(function (done) {
  init.run(done);
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
  var today = util2.today();
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
