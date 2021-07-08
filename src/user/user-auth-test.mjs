import * as assert2 from "../base/assert2.mjs";
import * as init from "../base/init.mjs";
import * as error from "../base/error.mjs";
import * as config from "../base/config.mjs";
import * as db from '../db/db.mjs';
import * as expl from "../express/express-local.mjs";
import * as expb from "../express/express-base.mjs";
import * as userb from "../user/user-base.mjs";
import * as userf from "../user/user-fixture.mjs";
import * as usera from "../user/user-auth.mjs";

expb.core.get('/api/test/user', function (req, res, done) {
  usera.checkUser(res, function (err, user) {
    if (err) return done(err);
    res.json({});
  });
});

expb.core.get('/api/test/admin', function (req, res, done) {
  usera.checkAdmin(res, function (err, user) {
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

describe('login', () => {
  it('session should be clear', done => {
    expl.get('/api/users/login').end(function (err, res) {
      assert2.ifError(err);
      assert2.ok(res.body.err);
      assert2.ok(error.find(res.body.err, 'NOT_AUTHENTICATED'));
      done();
    });
  });
  it('login should succeed', done => {
    userf.login('user1', function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      assert2.e(res.body.user.id, userf.users.user1.id);
      assert2.e(res.body.user.name, userf.users.user1.name);
      done();
    })
  });
  it('session should be filled', done => {
    expl.get('/api/users/login').end(function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      assert2.e(res.body.user.id, userf.users.user1.id);
      done();
    });
  });
  it('logout should succeed', done => {
    userf.logout(function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      done();
    })
  });
  it('session should be clear', done => {
    expl.get('/api/users/login').end(function (err, res) {
      assert2.ifError(err);
      assert2.ok(res.body.err);
      assert2.ok(error.find(res.body.err, 'NOT_AUTHENTICATED'));
      done();
    });
  });
  it('invalid email should fail', done => {
    const form = {email: 'xxx@xxx.com', password: 'xxxx'};
    expl.post('/api/users/login').send(form).end(function (err, res) {
      assert2.ifError(err);
      assert2.ok(res.body.err);
      assert2.e(res.body.err.code, 'INVALID_FORM');
      assert2.ok(error.find(res.body.err, 'EMAIL_NOT_FOUND'));
      done();
    });
  });
  it('invalid password should fail', done => {
    const form = {email: userf.users.user1.email, password: 'xxxx'};
    expl.post('/api/users/login').send(form).end(function (err, res) {
      assert2.ifError(err);
      assert2.ok(res.body.err);
      assert2.e(res.body.err.code, 'INVALID_FORM');
      assert2.ok(error.find(res.body.err, 'PASSWORD_WRONG'));
      done();
    });
  });
});

describe('accessing user resource', () => {
  it('given user session', done => {
    userf.login('user1', done);
  });
  it('should succeed', done => {
    expl.get('/api/test/user').end(function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      done();
    });
  });
  it('given no session', done => {
    userf.logout(done);
  });
  it('should fail', done => {
    expl.get('/api/test/user').end(function (err, res) {
      assert2.ifError(err);
      assert2.ok(res.body.err);
      assert2.ok(error.find(res.body.err, 'NOT_AUTHENTICATED'));
      done();
    });
  });
});

describe('accessing admin resource', () => {
  it('given admin session', done => {
    userf.login('admin', done);
  });
  it('should succeed', done => {
    expl.get('/api/test/admin').end(function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      done();
    })
  });
  it('given no session', done => {
    userf.logout(done);
  });
  it('should fail', done => {
    expl.get('/api/test/admin').end(function (err, res) {
      assert2.ifError(err);
      assert2.ok(res.body.err);
      assert2.ok(error.find(res.body.err, 'NOT_AUTHENTICATED'));
      done();
    });
  });
  it('given user session', done => {
    userf.login('user1', done);
  });
  it('should fail', done => {
    expl.get('/api/test/admin').end(function (err, res) {
      assert2.ifError(err);
      assert2.ok(res.body.err);
      assert2.ok(error.find(res.body.err, 'NOT_AUTHORIZED'));
      done();
    });
  });
});

describe('auto login', () => {
  it('given new (cookie clean) Agent', () => {
    expl.newAgent();
  });
  it('access should fail', done => {
    expl.get('/api/test/user').end(function (err, res) {
      assert2.ifError(err);
      assert2.ok(res.body.err);
      done();
    });
  });
  it('given login with auto login', done => {
    userf.login('user1', true, done);
  });
  it('access should succeed', done => {
    expl.get('/api/test/user').end(function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      done();
    });
  });
  it('given new session', done => {
    expl.post('/api/destroy-session').end(function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      done();
    });
  });
  it('access should succeed', done => {
    expl.get('/api/test/user').end(function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      done();
    });
  });
  it('given logged out', done => {
    userf.logout(done);
  });
  it('access should fail', done => {
    expl.get('/api/test/user').end(function (err, res) {
      assert2.ifError(err);
      assert2.ok(res.body.err);
      done();
    })
  });
});

describe('auto login with invalid email', () => {
  it('given new (cookie clean) Agent', () => {
    expl.newAgent();
  });
  it('access should fail', done => {
    expl.get('/api/test/user').end(function (err, res) {
      assert2.ifError(err);
      assert2.ok(res.body.err);
      done();
    });
  });
  it('given login with auto login', done => {
    userf.login('user1', true, done);
  });
  it('access should succeed', done => {
    expl.get('/api/test/user').end(function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      done();
    });
  });
  it('cookie should be filled', done => {
    expl.get('/api/cookies').end(function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      assert2.e(res.body.email, userf.users.user1.email);
      done();
    });
  });
  it('given email changed', done => {
    const fields = {
      $set: {
        email: 'new@def.com'
      }
    };
    db.query('update user set email = "new@def.com" where id = ?', userf.users.user1.id, (err, r) => {
      assert2.ifError(err);
      assert2.e(r.changedRows, 1);
      done();
    });
  });
  it('given new session', done => {
    expl.post('/api/destroy-session').end(function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      done();
    });
  });
  it('should fail', done => {
    expl.get('/api/test/user').end(function (err, res) {
      assert2.ifError(err);
      assert2.ok(res.body.err);
      done();
    });
  });
  it('cookie should be destroied', done => {
    expl.get('/api/cookies').end(function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      assert2.e(res.body.email, undefined);
      done();
    });
  });
});

describe('redirecting to login page', () => {
  it('given handler', done => {
    expb.core.get('/test/public', function (req, res, done) {
      res.send('public');
    });
    expb.core.get('/test/private', function (req, res, done) {
      usera.checkUser(res, function (err, user) {
        if (err) return done(err);
        res.send('private');
      })
    });
    done();
  });
  it('public should succeed', done => {
    expl.get('/test/public').end(function (err, res) {
      assert2.ifError(err);
      assert2.e(res.text, 'public');
      done();
    });
  });
  it('private should succeed', done => {
    expl.get('/test/private').redirects(0).end(function (err, res) {
      assert2.ok(err !== null);
      assert2.redirect(res, '/users/login');
      done();
    });
  });
});
