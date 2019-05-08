'use strict';

var init = require('../base/init');
var error = require('../base/error');
var config = require('../base/config')({ path: 'config/test.json' });
var mongo2 = require('../mongo/mongo2')({ dropDatabase: true });
var expb = require('../express/express-base');
var expl = require('../express/express-local');
var userb = require('../user/user-base');
var assert = require('assert');
var assert2 = require('../base/assert2');

before(function (done) {
  init.run(done);
});

describe('userb.users', function () {
  it('should exist', function () {
    assert2.ne(userb.users, undefined);
  });
});

describe('getNewId', function () {
  it('should succeed', function () {
    assert2.e(userb.getNewId() < userb.getNewId(), true);
  });
});
