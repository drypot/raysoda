'use strict';

const assert = require('assert');
const init = require('../base/init');
const config = require('../base/config');
const my2 = require('../mysql/my2');
const expb = require('../express/express-base');
const expl = require('../express/express-local');
const userb = require('../user/user-base');
const userf = require('../user/user-fixture');
const userxl = require('../userx/userx-list');

before(function (done) {
  config.path = 'config/raysoda-test.json';
  my2.dropDatabase = true;
  init.run(done);
});

before((done) => {
  expb.start();
  done();
});

describe('/api/users?q=user', function () {
  it('should succeed for user1', function (done) {
    expl.get('/api/users?q=user1', function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      assert.strictEqual(res.body.users.length, 1);
      var u = res.body.users[0];
      assert.strictEqual(u.id, 1);
      assert.strictEqual(u.name, 'user1');
      assert.strictEqual(u.home, 'user1');
      done();
    });
  });
  it('should succeed for USER1', function (done) {
    expl.get('/api/users?q=USER1', function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      assert.strictEqual(res.body.users.length, 1);
      var u = res.body.users[0];
      assert.strictEqual(u.id, 1);
      assert.strictEqual(u.name, 'user1');
      assert.strictEqual(u.home, 'user1');
      done();
    });
  });
  it.skip('should succeed for us', function (done) {
    expl.get('/api/users?q=us', function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      assert.strictEqual(res.body.users.length, 3);
      var u;
      u = res.body.users[0];
      assert.strictEqual(u.id, 1);
      assert.strictEqual(u.name, 'user1');
      assert.strictEqual(u.home, 'user1');
      u = res.body.users[2];
      assert.strictEqual(u.id, 3);
      assert.strictEqual(u.name, 'user3');
      assert.strictEqual(u.home, 'user3');
      done();
    });
  });
  it.skip('should succeed for [빈칸 which including RegExp character', function (done) {
    expl.get('/api/users?q=' + encodeURIComponent('[빈칸'), function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      assert.strictEqual(res.body.users.length, 0);
      done();
    });
  });
});

describe('/api/users?q=email', () => {
  describe('when not logged in', () => {
    it('should fail', function (done) {
      expl.get('/api/users?q=user1@mail.com', function (err, res) {
        assert.ifError(err);
        assert.ifError(res.body.err);
        assert.strictEqual(res.body.users.length, 0);
        done();
      });
    });
  });
  describe('when logged in as user1', () => {
    before(function (done) {
      userf.login('user1', done);
    });
    it('should fail', function (done) {
      expl.get('/api/users?q=user1@mail.com', function (err, res) {
        assert.ifError(err);
        assert.ifError(res.body.err);
        assert.strictEqual(res.body.users.length, 0);
        done();
      });
    });
  });
  describe('when logged in as admin', () => {
    before(function (done) {
      userf.login('admin', done);
    });
    it('should succeed', function (done) {
      expl.get('/api/users?q=user1@mail.com', function (err, res) {
        assert.ifError(err);
        assert.ifError(res.body.err);
        assert.strictEqual(res.body.users.length, 1);
        var u = res.body.users[0];
        assert.strictEqual(u.id, 1);
        assert.strictEqual(u.name, 'user1');
        assert.strictEqual(u.home, 'user1');
        done();
      });
    });
  });
});