'use strict';

const date2 = require('../base/date2');
const assert = require('assert');
const assert2 = require('../base/assert2');

describe('today', function () {
  it('should succeed', function (done) {
    var now = new Date();
    var today = date2.today();
    assert.strictEqual(today.getFullYear(), now.getFullYear());
    assert.strictEqual(today.getMonth(), now.getMonth());
    assert.strictEqual(today.getDate(), now.getDate());
    assert.strictEqual(today.getHours(), 0);
    assert.strictEqual(today.getMinutes(), 0);
    assert.strictEqual(today.getSeconds(), 0);
    assert.strictEqual(today.getMilliseconds(), 0);
    done();
  });
});

describe('dateFromString', function () {
  it('should succeed', function (done) {
    var d = date2.dateFromString('1974-05-16');
    assert.strictEqual(d.getFullYear(), 1974);
    assert.strictEqual(d.getMonth(), 4);
    assert.strictEqual(d.getDate(), 16);
    assert.strictEqual(d.getHours(), 0);
    assert.strictEqual(d.getMinutes(), 0);
    assert.strictEqual(d.getSeconds(), 0);
    assert.strictEqual(d.getMilliseconds(), 0);
    done();
  });
});

describe('dateTimeString', function () {
  it('should succeed', function () {
    var d = new Date(1974, 4, 16, 12, 0);
    assert.strictEqual(date2.dateTimeString(d), '1974-05-16 12:00:00');
  });
});

describe('dateString', function () {
  it('should succeed', function () {
    var d = new Date(1974, 4, 16, 12, 0);
    assert.strictEqual(date2.dateString(d), '1974-05-16');
  });
});

describe('dateStringNoDash', function () {
  it('should succeed', function () {
    var d = new Date(1974, 4, 16, 12, 0);
    assert.strictEqual(date2.dateStringNoDash(d), '19740516');
  });
});
