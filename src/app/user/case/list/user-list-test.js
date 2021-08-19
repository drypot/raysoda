import * as init from '../supp/base/init.mjs'
import * as config from '../supp/base/config.mjs'
import * as db from '../core/db/db.mjs'
import * as expb from '../express/express-base.mjs'
import * as userf from './/user-fixture.mjs'

beforeAll(async () => {
  config.setPath('config/raysoda-test.json');
  db.setDropDatabase(true);
  init.run(done);
});

beforeAll((done) => {
  expb.start();
  done();
});

describe('/api/users', () => {
  it('should work for page 1', async () => {
    request.get('/api/users?p=1&ps=3', function (err, res) {
      expect(err).toBeFalsy();
      expect(res.body.err).toBeFalsy();
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
  it('should work for page 2', async () => {
    request.get('/api/users?p=2&ps=3', function (err, res) {
      expect(err).toBeFalsy();
      expect(res.body.err).toBeFalsy();
      expect(res.body.users.length).toBe(1);
      let u;
      u = res.body.users[0];
      expect(u.name).toBe('admin');
      done();
    });
  });
});

describe('/api/users?q=user', () => {
  it('should work for user1', async () => {
    request.get('/api/users?q=user1', function (err, res) {
      expect(err).toBeFalsy();
      expect(res.body.err).toBeFalsy();
      expect(res.body.users.length).toBe(1);
      let u = res.body.users[0];
      expect(u.id).toBe(1);
      expect(u.name).toBe('user1');
      expect(u.home).toBe('user1');
      done();
    });
  });
  it('should work for USER1', async () => {
    request.get('/api/users?q=USER1', function (err, res) {
      expect(err).toBeFalsy();
      expect(res.body.err).toBeFalsy();
      expect(res.body.users.length).toBe(1);
      let u = res.body.users[0];
      expect(u.id).toBe(1);
      expect(u.name).toBe('user1');
      expect(u.home).toBe('user1');
      done();
    });
  });
  xit('should work for us', function (done) {
    request.get('/api/users?q=us', function (err, res) {
      expect(err).toBeFalsy();
      expect(res.body.err).toBeFalsy();
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
    'should work for [빈칸 which including RegExp character',
    function (done) {
      request.get('/api/users?q=' + encodeURIComponent('[빈칸'), function (err, res) {
        expect(err).toBeFalsy();
        expect(res.body.err).toBeFalsy();
        expect(res.body.users.length).toBe(0);
        done();
      });
    }
  );
});

describe('/api/users?q=email', () => {
  describe('when not logged in', () => {
    it('should fail', async () => {
      request.get('/api/users?q=user1@mail.test', function (err, res) {
        expect(err).toBeFalsy();
        expect(res.body.err).toBeFalsy();
        expect(res.body.users.length).toBe(0);
        done();
      });
    });
  });
  describe('when logged in as user1', () => {
    beforeAll(async () => {
      userf.login('user1', done);
    });
    it('should fail', async () => {
      request.get('/api/users?q=user1@mail.test', function (err, res) {
        expect(err).toBeFalsy();
        expect(res.body.err).toBeFalsy();
        expect(res.body.users.length).toBe(0);
        done();
      });
    });
  });
  describe('when logged in as admin', () => {
    beforeAll(async () => {
      userf.login('admin', done);
    });
    it('should work', async () => {
      request.get('/api/users?q=user1@mail.test', function (err, res) {
        expect(err).toBeFalsy();
        expect(res.body.err).toBeFalsy();
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
