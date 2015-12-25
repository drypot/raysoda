'use strict';

var init = require('../base/init');
var error = require('../base/error');
var config = require('../base/config')({ path: 'config/test.json' });
var mongo2 = require('../mongo/mongo2')({ dropDatabase: true });
var expl = require('../express/express-local');
var userb = require('../user/user-base');
var userf = require('../user/user-fixture');
var userl = require('../user/user-list');
var assert = require('assert');
var assert2 = require('../base/assert2');

before(function (done) {
  init.run(done);
});

describe('/api/users?q=', function () {
  it('should succeed for user1', function (done) {
    expl.get('/api/users?q=user1', function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      assert2.e(res.body.users.length, 1);
      var u = res.body.users[0];
      assert2.e(u._id, 1);
      assert2.e(u.name, 'user1');
      assert2.e(u.home, 'user1');
      done();
    });
  });
  it('should succeed for us', function (done) {
    expl.get('/api/users?q=us', function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      assert2.e(res.body.users.length, 3);
      var u;
      u = res.body.users[0];
      assert2.e(u._id, 1);
      assert2.e(u.name, 'user1');
      assert2.e(u.home, 'user1');
      u = res.body.users[2];
      assert2.e(u._id, 3);
      assert2.e(u.name, 'user3');
      assert2.e(u.home, 'user3');
      done();
    });
  });
  it('should succeed for [빈칸 which including RegExp character', function (done) {
    expl.get('/api/users?q=[빈칸', function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      assert2.e(res.body.users.length, 0);
      done();
    });
  });
});