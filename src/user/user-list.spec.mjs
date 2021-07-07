import * as assert2 from "../base/assert2.mjs";
import * as init from "../base/init.mjs";
import * as config from "../base/config.mjs";
import * as db from '../db/db.mjs';
import * as expb from "../express/express-base.mjs";
import * as expl from "../express/express-local.mjs";
import * as userb from "../user/user-base.mjs";
import * as userf from "../user/user-fixture.mjs";
import * as userl from "../user/user-list.mjs";

before(function (done) {
  config.setPath('config/raysoda-test.json');
  db.setDropDatabase(true);
  init.run(done);
});

before((done) => {
  expb.start();
  done();
});

describe('/api/users', () => {
  it('should succeed for page 1', function (done) {
    expl.get('/api/users?p=1&ps=3', function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      assert2.e(res.body.users.length, 3);
      let u;
      u = res.body.users[0];
      assert2.e(u.name, 'user2');
      u = res.body.users[1];
      assert2.e(u.name, 'user3');
      u = res.body.users[2];
      assert2.e(u.name, 'user1');
      done();
    });
  });
  it('should succeed for page 2', function (done) {
    expl.get('/api/users?p=2&ps=3', function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      assert2.e(res.body.users.length, 1);
      let u;
      u = res.body.users[0];
      assert2.e(u.name, 'admin');
      done();
    });
  });
});

describe('/api/users?q=user', function () {
  it('should succeed for user1', function (done) {
    expl.get('/api/users?q=user1', function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      assert2.e(res.body.users.length, 1);
      let u = res.body.users[0];
      assert2.e(u.id, 1);
      assert2.e(u.name, 'user1');
      assert2.e(u.home, 'user1');
      done();
    });
  });
  it('should succeed for USER1', function (done) {
    expl.get('/api/users?q=USER1', function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      assert2.e(res.body.users.length, 1);
      let u = res.body.users[0];
      assert2.e(u.id, 1);
      assert2.e(u.name, 'user1');
      assert2.e(u.home, 'user1');
      done();
    });
  });
  it.skip('should succeed for us', function (done) {
    expl.get('/api/users?q=us', function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      assert2.e(res.body.users.length, 3);
      let u;
      u = res.body.users[0];
      assert2.e(u.id, 1);
      assert2.e(u.name, 'user1');
      assert2.e(u.home, 'user1');
      u = res.body.users[2];
      assert2.e(u.id, 3);
      assert2.e(u.name, 'user3');
      assert2.e(u.home, 'user3');
      done();
    });
  });
  it.skip('should succeed for [빈칸 which including RegExp character', function (done) {
    expl.get('/api/users?q=' + encodeURIComponent('[빈칸'), function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      assert2.e(res.body.users.length, 0);
      done();
    });
  });
});

describe('/api/users?q=email', () => {
  describe('when not logged in', () => {
    it('should fail', function (done) {
      expl.get('/api/users?q=user1@mail.com', function (err, res) {
        assert2.ifError(err);
        assert2.ifError(res.body.err);
        assert2.e(res.body.users.length, 0);
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
        assert2.ifError(err);
        assert2.ifError(res.body.err);
        assert2.e(res.body.users.length, 0);
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
        assert2.ifError(err);
        assert2.ifError(res.body.err);
        assert2.e(res.body.users.length, 1);
        let u = res.body.users[0];
        assert2.e(u.id, 1);
        assert2.e(u.name, 'user1');
        assert2.e(u.home, 'user1');
        done();
      });
    });
  });
});
