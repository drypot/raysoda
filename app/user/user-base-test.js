'use strict';

const assert = require('assert');
const init = require('../base/init');
const config = require('../base/config');
const my2 = require('../mysql/my2');
const expb = require('../express/express-base');
const expl = require('../express/express-local');
const userb = require('../user/user-base');

before(function (done) {
  config.path = 'config/raysoda-test.json';
  my2.dropDatabase = true;
  init.run(done);
});

describe('table user', function () {
  it('should exist', function (done) {
    my2.tableExists('user', (err, exist) => {
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
