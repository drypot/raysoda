'use strict';

const assert = require('assert');
const init = require('../base/init');
const error = require('../base/error');
const config = require('../base/config');
const my2 = require('../mysql/my2');
const expb = require('../express/express-base');
const expl = require('../express/express-local');
const userb = require('../user/user-base');
const usera = require('../user/user-auth');
const userf = require('../user/user-fixture');
const userd = require('../user/user-deactivate');

expb.core.get('/api/test/user', function (req, res, done) {
  usera.checkUser(res, function (err, user) {
    if (err) return done(err);
    res.json({});
  });
});

before(function (done) {
  config.path = 'config/raysoda-test.json';
  my2.dropDatabase = true;
  init.run(done);
});

before((done) => {
  expb.start();
  done();
});

describe('deactivating self', function () {
  it('given user1 login', function (done) {
    userf.login('user1', done);
  });
  it('checkUser should succeed', function (done) {
    expl.get('/api/test/user').end(function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      done();
    })
  });
  it('should succeed', function (done) {
    expl.del('/api/users/' + userf.user1.id).end(function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      done();
    });
  });
  it('can be checked', function (done) {
    my2.queryOne('select * from user where id = ?', userf.user1.id, (err, user) => {
      assert.ifError(err);
      assert.strictEqual(user.status == 'd', true);
      done();
    });
  });
  it('checkUser should fail (because logged off)', function (done) {
    expl.get('/api/test/user').end(function (err, res) {
      assert.ifError(err);
      assert(res.body.err);
      assert(error.find(res.body.err, 'NOT_AUTHENTICATED'));
      done();
    });
  });
});

describe('deactivating with no login', function () {
  it('given no login', function (done) {
    userf.logout(done);
  });
  it('should fail', function (done) {
    expl.del('/api/users/' + userf.user2.id).end(function (err, res) {
      assert.ifError(err);
      assert(res.body.err);
      assert(error.find(res.body.err, 'NOT_AUTHENTICATED'));
      done();
    });
  });
});

describe('deactivating other', function () {
  it('given user2 login', function (done) {
    userf.login('user2', done);
  });
  it('deactivating other should fail', function (done) {
    expl.del('/api/users/' + userf.user3.id).end(function (err, res) {
      assert.ifError(err);
      assert(res.body.err);
      assert(error.find(res.body.err, 'NOT_AUTHORIZED'));
      done();
    });
  });
});

describe('deactivating other by admin', function () {
  it('given admin login', function (done) {
    userf.login('admin', done);
  });
  it('should succeed', function (done) {
    expl.del('/api/users/' + userf.user3.id).end(function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      done();
    });
  });
});