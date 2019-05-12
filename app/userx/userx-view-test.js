'use strict';

const init = require('../base/init');
const error = require('../base/error');
const config = require('../base/config');
const my2 = require('../mysql/my2');
const expb = require('../express/express-base');
const expl = require('../express/express-local');
const userb = require('../user/user-base');
const userf = require('../user/user-fixture');
const userxv = require('../userx/userx-view');
const assert = require('assert');
const assert2 = require('../base/assert2');

before(function (done) {
  config.path = 'config/raysoda-test.json';
  my2.dropDatabase = true;
  init.run(done);
});

before((done) => {
  expb.start();
  done();
});

describe('get /users/:id([0-9]+)', function () {
  it('should succeed', function (done) {
    expl.get('/users/1').end(function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      done();
    });
  });
});

describe('get /:name([^/]+)', function () {
  it('should succeed for /user1', function (done) {
    expl.get('/user1').end(function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      done();
    });
  });
  it('should succeed for /USER1', function (done) {
    expl.get('/USER1').end(function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      done();
    });
  });
  it('should fail with invalid name', function (done) {
    expl.get('/xman').end(function (err, res) {
      assert(err !== null);
      done();
    });
  });
});
