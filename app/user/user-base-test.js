'use strict';

const init = require('../base/init');
const error = require('../base/error');
const config = require('../base/config');
const mysql2 = require('../mysql/mysql2');
const expb = require('../express/express-base');
const expl = require('../express/express-local');
const userb = require('../user/user-base');
const assert = require('assert');
const assert2 = require('../base/assert2');

before(function (done) {
  config.path = 'config/raysoda-test.json';
  mysql2.dropDatabase = true;
  init.run(done);
});

describe('table user', function () {
  it('should exist', function (done) {
    mysql2.tableExists('user', (err, exist) => {
      assert.ifError(err);
      assert(exist);
      done();
    });
  });
  it('getNewId should success', function () {
    assert(userb.getNewId() === 1);
    assert(userb.getNewId() < userb.getNewId());
  });
});
