'use strict';

const init = require('../base/init');
const error = require('../base/error');
const config = require('../base/config');
const mongo2 = require('../mongo/mongo2');
const expb = require('../express/express-base');
const expl = require('../express/express-local');
const userb = require('../user/user-base');
const assert = require('assert');
const assert2 = require('../base/assert2');

before(function (done) {
  config.path = 'config/test.json';
  mongo2.dropDatabase = true;
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
