import * as assert2 from "../base/assert2.js";
import * as init from "../base/init.js";
import * as error from "../base/error.js";
import * as config from "../base/config.js";
import * as db from '../db/db.js';
import * as expb from "../express/express-base.js";
import * as expl from "../express/express-local.js";
import * as userb from "../user/user-base.js";
import * as usera from "../user/user-auth.js";
import * as userf from "../user/user-fixture.js";
import * as userd from "../user/user-deactivate.js";

expb.core.get('/api/test/user', function (req, res, done) {
  usera.checkUser(res, function (err, user) {
    if (err) return done(err);
    res.json({});
  });
});

before(function (done) {
  config.setPath('config/raysoda-test.json');
  db.setDropDatabase(true);
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
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      done();
    })
  });
  it('should succeed', function (done) {
    expl.del('/api/users/' + userf.users.user1.id).end(function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      done();
    });
  });
  it('can be checked', function (done) {
    db.queryOne('select * from user where id = ?', userf.users.user1.id, (err, user) => {
      assert2.ifError(err);
      assert2.e(user.status === 'd', true);
      done();
    });
  });
  it('checkUser should fail (because logged off)', function (done) {
    expl.get('/api/test/user').end(function (err, res) {
      assert2.ifError(err);
      assert2.ok(res.body.err);
      assert2.ok(error.find(res.body.err, 'NOT_AUTHENTICATED'));
      done();
    });
  });
});

describe('deactivating with no login', function () {
  it('given no login', function (done) {
    userf.logout(done);
  });
  it('should fail', function (done) {
    expl.del('/api/users/' + userf.users.user2.id).end(function (err, res) {
      assert2.ifError(err);
      assert2.ok(res.body.err);
      assert2.ok(error.find(res.body.err, 'NOT_AUTHENTICATED'));
      done();
    });
  });
});

describe('deactivating other', function () {
  it('given user2 login', function (done) {
    userf.login('user2', done);
  });
  it('deactivating other should fail', function (done) {
    expl.del('/api/users/' + userf.users.user3.id).end(function (err, res) {
      assert2.ifError(err);
      assert2.ok(res.body.err);
      assert2.ok(error.find(res.body.err, 'NOT_AUTHORIZED'));
      done();
    });
  });
});

describe('deactivating other by admin', function () {
  it('given admin login', function (done) {
    userf.login('admin', done);
  });
  it('should succeed', function (done) {
    expl.del('/api/users/' + userf.users.user3.id).end(function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      done();
    });
  });
});
