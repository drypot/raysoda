'use strict';

var assert = require('assert');
var assert2 = require('../base/assert2');

describe('aliases', function () {
  it('should succeed', function (done) {
    assert2.e('abc', 'abc');
    assert2.ne('abc', 'def');
    assert2.de([1], [1]);
    assert2.nde([1], [2]);
    done();
  });
});

describe('path', function () {
  it('should succeed', function (done) {
    assert2.path('server/base/assert2.js');
    assert2.path('server/base/assertX.js', false);
    done();
  });
});

describe('redirect', function () {
  it('should succeed', function (done) {
    assert2.redirect({
      status: 301,
      header: {
        location: '/new301'
      }
    }, '/new301');
    assert2.redirect({
      status: 302,
      header: {
        location: '/new302'
      }
    }, '/new302');
    done();
  });
});