import * as assert2 from "../base/assert2.mjs";
import * as init from "../base/init.mjs";
import * as error from "../base/error.mjs";
import * as config from "../base/config.mjs";
import * as db from '../db/db.mjs';
import * as expb from "../express/express-base.mjs";
import * as expl from "../express/express-local.mjs";
import * as userb from "../user/user-base.mjs";
import * as usera from "../user/user-auth.mjs";
import * as userf from "../user/user-fixture.mjs";
import * as userd from "../user/user-deactivate.mjs";

expb.core.get('/api/test/user', function (req, res, done) {
  usera.checkUser(res, function (err, user) {
    if (err) return done(err);
    res.json({});
  });
});

beforeAll(done => {
  config.setPath('config/raysoda-test.json');
  db.setDropDatabase(true);
  init.run(done);
});

beforeAll((done) => {
  expb.start();
  done();
});

describe('deactivating self', () => {
  it('given user1 login', done => {
    userf.login('user1', done);
  });
  it('checkUser should succeed', done => {
    expl.get('/api/test/user').end(function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      done();
    })
  });
  it('should succeed', done => {
    expl.del('/api/users/' + userf.users.user1.id).end(function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      done();
    });
  });
  it('can be checked', done => {
    db.queryOne('select * from user where id = ?', userf.users.user1.id, (err, user) => {
      assert2.ifError(err);
      assert2.e(user.status === 'd', true);
      done();
    });
  });
  it('checkUser should fail (because logged off)', done => {
    expl.get('/api/test/user').end(function (err, res) {
      assert2.ifError(err);
      assert2.ok(res.body.err);
      assert2.ok(error.find(res.body.err, 'NOT_AUTHENTICATED'));
      done();
    });
  });
});

describe('deactivating with no login', () => {
  it('given no login', done => {
    userf.logout(done);
  });
  it('should fail', done => {
    expl.del('/api/users/' + userf.users.user2.id).end(function (err, res) {
      assert2.ifError(err);
      assert2.ok(res.body.err);
      assert2.ok(error.find(res.body.err, 'NOT_AUTHENTICATED'));
      done();
    });
  });
});

describe('deactivating other', () => {
  it('given user2 login', done => {
    userf.login('user2', done);
  });
  it('deactivating other should fail', done => {
    expl.del('/api/users/' + userf.users.user3.id).end(function (err, res) {
      assert2.ifError(err);
      assert2.ok(res.body.err);
      assert2.ok(error.find(res.body.err, 'NOT_AUTHORIZED'));
      done();
    });
  });
});

describe('deactivating other by admin', () => {
  it('given admin login', done => {
    userf.login('admin', done);
  });
  it('should succeed', done => {
    expl.del('/api/users/' + userf.users.user3.id).end(function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      done();
    });
  });
});
