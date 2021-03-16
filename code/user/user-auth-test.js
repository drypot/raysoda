import * as assert2 from "../base/assert2.js";
import * as init from "../base/init.js";
import * as error from "../base/error.js";
import * as config from "../base/config.js";
import * as db from '../db/db.js';
import * as expl from "../express/express-local.js";
import * as expb from "../express/express-base.js";
import * as userb from "../user/user-base.js";
import * as userf from "../user/user-fixture.js";
import * as usera from "../user/user-auth.js";

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

before(function (done) {
  config.setPath('config/raysoda-test.json');
  db.setDropDatabase(true);
  init.run(done);
});

before((done) => {
  expb.start();
  done();
});

describe('login', function () {
  it('session should be clear', function (done) {
    expl.get('/api/users/login').end(function (err, res) {
      assert2.ifError(err);
      assert2.ok(res.body.err);
      assert2.ok(error.find(res.body.err, 'NOT_AUTHENTICATED'));
      done();
    });
  });
  it('login should succeed', function (done) {
    userf.login('user1', function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      assert2.e(res.body.user.id, userf.users.user1.id);
      assert2.e(res.body.user.name, userf.users.user1.name);
      done();
    })
  });
  it('session should be filled', function (done) {
    expl.get('/api/users/login').end(function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      assert2.e(res.body.user.id, userf.users.user1.id);
      done();
    });
  });
  it('logout should succeed', function (done) {
    userf.logout(function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      done();
    })
  });
  it('session should be clear', function (done) {
    expl.get('/api/users/login').end(function (err, res) {
      assert2.ifError(err);
      assert2.ok(res.body.err);
      assert2.ok(error.find(res.body.err, 'NOT_AUTHENTICATED'));
      done();
    });
  });
  it('invalid email should fail', function (done) {
    const form = {email: 'xxx@xxx.com', password: 'xxxx'};
    expl.post('/api/users/login').send(form).end(function (err, res) {
      assert2.ifError(err);
      assert2.ok(res.body.err);
      assert2.ok(error.find(res.body.err, 'EMAIL_NOT_FOUND'));
      done();
    });
  });
  it('invalid password should fail', function (done) {
    const form = {email: userf.users.user1.email, password: 'xxxx'};
    expl.post('/api/users/login').send(form).end(function (err, res) {
      assert2.ifError(err);
      assert2.ok(res.body.err);
      assert2.ok(error.find(res.body.err, 'PASSWORD_WRONG'));
      done();
    });
  });
});

describe('accessing user resource', function () {
  it('given user session', function (done) {
    userf.login('user1', done);
  });
  it('should succeed', function (done) {
    expl.get('/api/test/user').end(function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      done();
    });
  });
  it('given no session', function (done) {
    userf.logout(done);
  });
  it('should fail', function (done) {
    expl.get('/api/test/user').end(function (err, res) {
      assert2.ifError(err);
      assert2.ok(res.body.err);
      assert2.ok(error.find(res.body.err, 'NOT_AUTHENTICATED'));
      done();
    });
  });
});

describe('accessing admin resource', function () {
  it('given admin session', function (done) {
    userf.login('admin', done);
  });
  it('should succeed', function (done) {
    expl.get('/api/test/admin').end(function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      done();
    })
  });
  it('given no session', function (done) {
    userf.logout(done);
  });
  it('should fail', function (done) {
    expl.get('/api/test/admin').end(function (err, res) {
      assert2.ifError(err);
      assert2.ok(res.body.err);
      assert2.ok(error.find(res.body.err, 'NOT_AUTHENTICATED'));
      done();
    });
  });
  it('given user session', function (done) {
    userf.login('user1', done);
  });
  it('should fail', function (done) {
    expl.get('/api/test/admin').end(function (err, res) {
      assert2.ifError(err);
      assert2.ok(res.body.err);
      assert2.ok(error.find(res.body.err, 'NOT_AUTHORIZED'));
      done();
    });
  });
});

describe('auto login', function () {
  it('given new (cookie clean) Agent',function () {
    expl.newAgent();
  });
  it('access should fail', function (done) {
    expl.get('/api/test/user').end(function (err, res) {
      assert2.ifError(err);
      assert2.ok(res.body.err);
      done();
    });
  });
  it('given login with auto login', function (done) {
    userf.login('user1', true, done);
  });
  it('access should succeed', function (done) {
    expl.get('/api/test/user').end(function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      done();
    });
  });
  it('given new session', function (done) {
    expl.post('/api/destroy-session').end(function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      done();
    });
  });
  it('access should succeed', function (done) {
    expl.get('/api/test/user').end(function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      done();
    });
  });
  it('given logged out', function (done) {
    userf.logout(done);
  });
  it('access should fail', function (done) {
    expl.get('/api/test/user').end(function (err, res) {
      assert2.ifError(err);
      assert2.ok(res.body.err);
      done();
    })
  });
});

describe('auto login with invalid email', function () {
  it('given new (cookie clean) Agent',function () {
    expl.newAgent();
  });
  it('access should fail', function (done) {
    expl.get('/api/test/user').end(function (err, res) {
      assert2.ifError(err);
      assert2.ok(res.body.err);
      done();
    });
  });
  it('given login with auto login', function (done) {
    userf.login('user1', true, done);
  });
  it('access should succeed', function (done) {
    expl.get('/api/test/user').end(function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      done();
    });
  });
  it('cookie should be filled', function (done) {
    expl.get('/api/cookies').end(function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      assert2.e(res.body.email, userf.users.user1.email);
      done();
    });
  });
  it('given email changed', function (done) {
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
  it('given new session', function (done) {
    expl.post('/api/destroy-session').end(function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      done();
    });
  });
  it('should fail', function (done) {
    expl.get('/api/test/user').end(function (err, res) {
      assert2.ifError(err);
      assert2.ok(res.body.err);
      done();
    });
  });
  it('cookie should be destroied', function (done) {
    expl.get('/api/cookies').end(function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      assert2.e(res.body.email, undefined);
      done();
    });
  });
});

describe('redirecting to login page', function () {
  it('given handler', function (done) {
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
  it('public should succeed', function (done) {
    expl.get('/test/public').end(function (err, res) {
      assert2.ifError(err);
      assert2.e(res.text, 'public');
      done();
    });
  });
  it('private should succeed', function (done) {
    expl.get('/test/private').redirects(0).end(function (err, res) {
      assert2.ok(err !== null);
      assert2.redirect(res, '/users/login');
      done();
    });
  });
});
