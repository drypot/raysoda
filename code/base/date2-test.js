'use strict';

const assert = require('assert');
const date2 = require('../base/date2');

describe('today', function () {
  it('should succeed', function (done) {
    let now = new Date();
    let today = date2.today();
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

describe('makeDateString', function () {
  it('should succeed', function () {
    let d = new Date(1974, 4, 16, 12, 0);
    assert.strictEqual(date2.makeDateString(d), '1974-05-16');
  });
});

describe('makeDatePacked', function () {
  it('should succeed', function () {
    let d = new Date(1974, 4, 16, 12, 0);
    assert.strictEqual(date2.makeDatePacked(d), '19740516');
  });
});

describe('parseDateString', function () {
  it('should succeed', function () {
    let d = date2.parseDateString('1974-05-16');
    assert.strictEqual(d.getFullYear(), 1974);
    assert.strictEqual(d.getMonth(), 4);
    assert.strictEqual(d.getDate(), 16);
    assert.strictEqual(d.getHours(), 0);
    assert.strictEqual(d.getMinutes(), 0);
    assert.strictEqual(d.getSeconds(), 0);
    assert.strictEqual(d.getMilliseconds(), 0);
  });
});

describe('makeDateTimeString', function () {
  it('should succeed', function () {
    let d = new Date(1974, 4, 16, 12, 0);
    assert.strictEqual(date2.makeDateTimeString(d), '1974-05-16 12:00:00');
  });
});

describe('makeDateTimeMilliPacked', function () {
  it('should succeed', function () {
    let d = new Date(1974, 4, 16, 12, 13, 14, 115);
    assert.strictEqual(date2.makeDateTimeMilliPacked(d), '19740516121314115');
    let d2 = new Date(1974, 4, 16, 12, 3, 4, 15);
    assert.strictEqual(date2.makeDateTimeMilliPacked(d2), '19740516120304015');
    let d3 = new Date(1974, 4, 16, 12, 3, 4, 5);
    assert.strictEqual(date2.makeDateTimeMilliPacked(d3), '19740516120304005');
  });
});

describe('parseDateTimeMilliPacked', function () {
  it('should succeed', function () {
    let d = date2.parseDateTimeMilliPacked('19740516120304005');
    assert.strictEqual(d.getFullYear(), 1974);
    assert.strictEqual(d.getMonth(), 4);
    assert.strictEqual(d.getDate(), 16);
    assert.strictEqual(d.getHours(), 12);
    assert.strictEqual(d.getMinutes(), 3);
    assert.strictEqual(d.getSeconds(), 4);
    assert.strictEqual(d.getMilliseconds(), 5);
  });
  it('should succeed only with date', function () {
    let d = date2.parseDateTimeMilliPacked('19740516');
    assert.strictEqual(d.getFullYear(), 1974);
    assert.strictEqual(d.getMonth(), 4);
    assert.strictEqual(d.getDate(), 16);
    assert.strictEqual(d.getHours(), 0);
    assert.strictEqual(d.getMinutes(), 0);
    assert.strictEqual(d.getSeconds(), 0);
    assert.strictEqual(d.getMilliseconds(), 0);
  });
  it('should succeed for non digit', function () {
    let d = date2.parseDateTimeMilliPacked('undefined');
    assert.strictEqual(d.getFullYear(), NaN);
    assert.strictEqual(d.getMonth(), NaN);
    assert.strictEqual(d.getDate(), NaN);
    assert.strictEqual(d.getHours(), NaN);
    assert.strictEqual(d.getMinutes(), NaN);
    assert.strictEqual(d.getSeconds(), NaN);
    assert.strictEqual(d.getMilliseconds(), NaN);
  });
});
