'use strict';

var init = require('../base/init');
var error = require('../base/error');
var config = require('../base/config')({ path: 'config/test.json' });
var mongo2 = require('../mongo/mongo2')({ dropDatabase: true });
var expb = require('../express/express-base');
var expl = require('../express/express-local');
var userb = require('../user/user-base');
var usera = require('../user/user-auth');
var userf = require('../user/user-fixture');
var assert = require('assert');
var assert2 = require('../base/assert2');

init.add(function (done) {
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

  done();
});

before(function (done) {
  init.run(done);
});

describe('login', function () {
  it('session should be clear', function (done) {
    expl.get('/api/users/login').end(function (err, res) {
      assert.ifError(err);
      assert2.ne(res.body.err, undefined);
      assert(error.find(res.body.err, 'NOT_AUTHENTICATED'));
      done();
    });
  });
  it('login should succeed', function (done) {
    userf.login('user1', function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      assert2.e(res.body.user.id, userf.user1._id);
      assert2.e(res.body.user.name, userf.user1.name);
      done();
    })
  });
  it('session should be filled', function (done) {
    expl.get('/api/users/login').end(function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      assert2.e(res.body.user.id, userf.user1._id);
      done();
    });
  });
  it('logout should succeed', function (done) {
    userf.logout(function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      done();
    })
  });
  it('session should be clear', function (done) {
    expl.get('/api/users/login').end(function (err, res) {
      assert.ifError(err);
      assert2.ne(res.body.err, undefined);
      assert(error.find(res.body.err, 'NOT_AUTHENTICATED'));
      done();
    });
  });
  it('invalid email should fail', function (done) {
    var form = { email: 'xxx@xxx.com', password: 'xxxx' };
    expl.post('/api/users/login').send(form).end(function (err, res) {
      assert.ifError(err);
      assert2.ne(res.body.err, undefined);
      assert(error.find(res.body.err, 'EMAIL_NOT_FOUND'));
      done();
    });
  });
  it('invalid password should fail', function (done) {
    var form = { email: userf.user1.email, password: 'xxxx' };
    expl.post('/api/users/login').send(form).end(function (err, res) {
      assert.ifError(err);
      assert2.ne(res.body.err, undefined);
      assert(error.find(res.body.err, 'PASSWORD_WRONG'));
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
      assert.ifError(err);
      assert.ifError(res.body.err);
      done();
    });
  });
  it('given no session', function (done) {
    userf.logout(done);
  });
  it('should fail', function (done) {
    expl.get('/api/test/user').end(function (err, res) {
      assert.ifError(err);
      assert2.ne(res.body.err, undefined);
      assert(error.find(res.body.err, 'NOT_AUTHENTICATED'));
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
      assert.ifError(err);
      assert.ifError(res.body.err);
      done();
    })
  });
  it('given no session', function (done) {
    userf.logout(done);
  });
  it('should fail', function (done) {
    expl.get('/api/test/admin').end(function (err, res) {
      assert.ifError(err);
      assert2.ne(res.body.err, undefined);
      assert(error.find(res.body.err, 'NOT_AUTHENTICATED'));
      done();
    });
  });
  it('given user session', function (done) {
    userf.login('user1', done);
  });
  it('should fail', function (done) {
    expl.get('/api/test/admin').end(function (err, res) {
      assert.ifError(err);
      assert2.ne(res.body.err, undefined);
      assert(error.find(res.body.err, 'NOT_AUTHORIZED'));
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
      assert.ifError(err);
      assert2.ne(res.body.err, undefined);
      done();
    });
  });
  it('given login with auto login', function (done) {
    userf.login('user1', true, done);
  });
  it('access should succeed', function (done) {
    expl.get('/api/test/user').end(function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      done();
    });
  });
  it('given new session', function (done) {
    expl.post('/api/destroy-session').end(function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      done();
    });
  });
  it('access should succeed', function (done) {
    expl.get('/api/test/user').end(function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      done();
    });
  });
  it('given logged out', function (done) {
    userf.logout(done);
  });
  it('access should fail', function (done) {
    expl.get('/api/test/user').end(function (err, res) {
      assert.ifError(err);
      assert2.ne(res.body.err, undefined);
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
      assert.ifError(err);
      assert2.ne(res.body.err, undefined);
      done();
    });
  });
  it('given login with auto login', function (done) {
    userf.login('user1', true, done);
  });
  it('access should succeed', function (done) {
    expl.get('/api/test/user').end(function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      done();
    });
  });
  it('cookie should be filled', function (done) {
    expl.get('/api/cookies').end(function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      assert2.e(res.body.email, userf.user1.email);
      done();
    });
  });
  it('given email changed', function (done) {
    var fields = {
      email: 'new@def.com'
    };
    userb.users.updateOne({ _id: userf.user1._id }, fields, function (err, r) {
      assert.ifError(err);
      assert2.e(r.matchedCount, 1);
      done();
    });
  });
  it('given new session', function (done) {
    expl.post('/api/destroy-session').end(function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      done();
    });
  });
  it('should fail', function (done) {
    expl.get('/api/test/user').end(function (err, res) {
      assert.ifError(err);
      assert2.ne(res.body.err, undefined);
      done();
    });
  });
  it('cookie should be destroied', function (done) {
    expl.get('/api/cookies').end(function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
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
      assert.ifError(err);
      assert2.e(res.text, 'public');
      done();
    });
  });
  it('private should succeed', function (done) {
    expl.get('/test/private').redirects(0).end(function (err, res) {
      assert(err !== null);
      assert2.redirect(res, '/users/login');
      done();
    });
  });
});