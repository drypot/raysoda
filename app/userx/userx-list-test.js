'use strict';

const init = require('../base/init');
const error = require('../base/error');
const config = require('../base/config');
const my2 = require('../mysql/my2');
const expl = require('../express/express-local');
const userb = require('../user/user-base');
const userf = require('../user/user-fixture');
const userxl = require('../userx/userx-list');
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

describe('/api/users?q=', function () {
  it('should succeed for user1', function (done) {
    expl.get('/api/users?q=user1', function (err, res) {
      assert.ifError(err);
      assert2.empty(res.body.err);
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
      assert2.empty(res.body.err);
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
    expl.get('/api/users?q=' + encodeURIComponent('[빈칸'), function (err, res) {
      assert.ifError(err);
      assert2.empty(res.body.err);
      assert2.e(res.body.users.length, 0);
      done();
    });
  });
});
