import * as init from "../base/init.mjs";
import * as config from "../base/config.mjs";
import * as db from '../db/db.mjs';
import * as expb from "../express/express-base.mjs";
import * as expl from "../express/express-local.mjs";
import * as userb from "../user/user-base.mjs";
import * as userf from "../user/user-fixture.mjs";
import * as userl from "../user/user-list.mjs";

beforeAll(done => {
  config.setPath('config/raysoda-test.json');
  db.setDropDatabase(true);
  init.run(done);
});

beforeAll((done) => {
  expb.start();
  done();
});

describe('/api/users', () => {
  it('should succeed for page 1', done => {
    expl.get('/api/users?p=1&ps=3', function (err, res) {
      expect(err).toBeFalsy();
      assert2.ifError(res.body.err);
      expect(res.body.users.length).toBe(3);
      let u;
      u = res.body.users[0];
      expect(u.name).toBe('user2');
      u = res.body.users[1];
      expect(u.name).toBe('user3');
      u = res.body.users[2];
      expect(u.name).toBe('user1');
      done();
    });
  });
  it('should succeed for page 2', done => {
    expl.get('/api/users?p=2&ps=3', function (err, res) {
      expect(err).toBeFalsy();
      assert2.ifError(res.body.err);
      expect(res.body.users.length).toBe(1);
      let u;
      u = res.body.users[0];
      expect(u.name).toBe('admin');
      done();
    });
  });
});

describe('/api/users?q=user', () => {
  it('should succeed for user1', done => {
    expl.get('/api/users?q=user1', function (err, res) {
      expect(err).toBeFalsy();
      assert2.ifError(res.body.err);
      expect(res.body.users.length).toBe(1);
      let u = res.body.users[0];
      expect(u.id).toBe(1);
      expect(u.name).toBe('user1');
      expect(u.home).toBe('user1');
      done();
    });
  });
  it('should succeed for USER1', done => {
    expl.get('/api/users?q=USER1', function (err, res) {
      expect(err).toBeFalsy();
      assert2.ifError(res.body.err);
      expect(res.body.users.length).toBe(1);
      let u = res.body.users[0];
      expect(u.id).toBe(1);
      expect(u.name).toBe('user1');
      expect(u.home).toBe('user1');
      done();
    });
  });
  xit('should succeed for us', function (done) {
    expl.get('/api/users?q=us', function (err, res) {
      expect(err).toBeFalsy();
      assert2.ifError(res.body.err);
      expect(res.body.users.length).toBe(3);
      let u;
      u = res.body.users[0];
      expect(u.id).toBe(1);
      expect(u.name).toBe('user1');
      expect(u.home).toBe('user1');
      u = res.body.users[2];
      expect(u.id).toBe(3);
      expect(u.name).toBe('user3');
      expect(u.home).toBe('user3');
      done();
    });
  });
  xit(
    'should succeed for [빈칸 which including RegExp character',
    function (done) {
      expl.get('/api/users?q=' + encodeURIComponent('[빈칸'), function (err, res) {
        expect(err).toBeFalsy();
        assert2.ifError(res.body.err);
        expect(res.body.users.length).toBe(0);
        done();
      });
    }
  );
});

describe('/api/users?q=email', () => {
  describe('when not logged in', () => {
    it('should fail', done => {
      expl.get('/api/users?q=user1@mail.com', function (err, res) {
        expect(err).toBeFalsy();
        assert2.ifError(res.body.err);
        expect(res.body.users.length).toBe(0);
        done();
      });
    });
  });
  describe('when logged in as user1', () => {
    beforeAll(done => {
      userf.login('user1', done);
    });
    it('should fail', done => {
      expl.get('/api/users?q=user1@mail.com', function (err, res) {
        expect(err).toBeFalsy();
        assert2.ifError(res.body.err);
        expect(res.body.users.length).toBe(0);
        done();
      });
    });
  });
  describe('when logged in as admin', () => {
    beforeAll(done => {
      userf.login('admin', done);
    });
    it('should succeed', done => {
      expl.get('/api/users?q=user1@mail.com', function (err, res) {
        expect(err).toBeFalsy();
        assert2.ifError(res.body.err);
        expect(res.body.users.length).toBe(1);
        let u = res.body.users[0];
        expect(u.id).toBe(1);
        expect(u.name).toBe('user1');
        expect(u.home).toBe('user1');
        done();
      });
    });
  });
});
