import * as init from "../supp/base/init.mjs";
import * as error from "../supp/base/error.mjs";
import * as config from "../supp/base/config.mjs";
import * as db from '../core/db/db.mjs';
import * as expl from "../express/express-local.mjs";
import * as expb from "../express/express-base.mjs";
import * as userb from ".//user-base.mjs";
import * as userf from ".//user-fixture.mjs";
import * as usera from ".//user-auth.mjs";

server.router.get('/api/test/user', function (req, res, done) {
  usera.getSessionUser(res, function (err, user) {
    if (err) return done(err);
    res.json({});
  });
});

server.router.get('/api/test/admin', function (req, res, done) {
  usera.getSessionAdmin(res, function (err, user) {
    if (err) return done(err);
    res.json({});
  });
});

beforeAll(async () => {
  config.setPath('config/raysoda-test.json');
  db.setDropDatabase(true);
  init.run(done);
});

beforeAll((done) => {
  expb.start();
  done();
});

describe('login', () => {
  it('session should be clear', async () => {
    const res = await request.get('/api/user/login')
      expect(err).toBeFalsy();
      expect(res.body.err).toBeTruthy();
      assert2.ok(error.lookupErrors(res.body.err, 'NOT_AUTHENTICATED'));
      done();
    });
  });
  it('login should work', async () => {
    userf.login('user1', function (err, res) {
      expect(err).toBeFalsy();
      expect(res.body.err).toBeFalsy();
      expect(res.body.user.id).toBe(userf.users.user1.id);
      expect(res.body.user.name).toBe(userf.users.user1.name);
      done();
    })
  });
  it('session should be filled', async () => {
    const res = await request.get('/api/user/login')
      expect(err).toBeFalsy();
      expect(res.body.err).toBeFalsy();
      expect(res.body.user.id).toBe(userf.users.user1.id);
      done();
    });
  });
  it('logout should work', async () => {
    userf.logout(function (err, res) {
      expect(err).toBeFalsy();
      expect(res.body.err).toBeFalsy();
      done();
    })
  });
  it('session should be clear', async () => {
    const res = await request.get('/api/user/login')
      expect(err).toBeFalsy();
      expect(res.body.err).toBeTruthy();
      assert2.ok(error.lookupErrors(res.body.err, 'NOT_AUTHENTICATED'));
      done();
    });
  });
  it('invalid email should fail', async () => {
    const form = {email: 'xxx@xxx.com', password: 'xxxx'};
    const res = await request.post('/api/user/login').send(form)
      expect(err).toBeFalsy();
      expect(res.body.err).toBeTruthy();
      expect(res.body.err.code).toBe('INVALID_FORM');
      assert2.ok(error.lookupErrors(res.body.err, 'EMAIL_NOT_FOUND'));
      done();
    });
  });
  it('invalid password should fail', async () => {
    const form = {email: userf.users.user1.email, password: 'xxxx'};
    const res = await request.post('/api/user/login').send(form)
      expect(err).toBeFalsy();
      expect(res.body.err).toBeTruthy();
      expect(res.body.err.code).toBe('INVALID_FORM');
      assert2.ok(error.lookupErrors(res.body.err, 'PASSWORD_WRONG'));
      done();
    });
  });
});

describe('accessing user resource', () => {
  it('given user session', async () => {
    userf.login('user1', done);
  });
  it('should work', async () => {
    const res = await request.get('/api/test/user')
      expect(err).toBeFalsy();
      expect(res.body.err).toBeFalsy();
      done();
    });
  });
  it('given no session', async () => {
    userf.logout(done);
  });
  it('should fail', async () => {
    const res = await request.get('/api/test/user')
      expect(err).toBeFalsy();
      expect(res.body.err).toBeTruthy();
      assert2.ok(error.lookupErrors(res.body.err, 'NOT_AUTHENTICATED'));
      done();
    });
  });
});

describe('accessing admin resource', () => {
  it('given admin session', async () => {
    userf.login('admin', done);
  });
  it('should work', async () => {
    const res = await request.get('/api/test/admin')
      expect(err).toBeFalsy();
      expect(res.body.err).toBeFalsy();
      done();
    })
  });
  it('given no session', async () => {
    userf.logout(done);
  });
  it('should fail', async () => {
    const res = await request.get('/api/test/admin')
      expect(err).toBeFalsy();
      expect(res.body.err).toBeTruthy();
      assert2.ok(error.lookupErrors(res.body.err, 'NOT_AUTHENTICATED'));
      done();
    });
  });
  it('given user session', async () => {
    userf.login('user1', done);
  });
  it('should fail', async () => {
    const res = await request.get('/api/test/admin')
      expect(err).toBeFalsy();
      expect(res.body.err).toBeTruthy();
      assert2.ok(error.lookupErrors(res.body.err, 'NOT_AUTHORIZED'));
      done();
    });
  });
});

describe('auto login', () => {
  it('given new (cookie clean) Agent', () => {
    expl.newAgent();
  });
  it('access should fail', async () => {
    const res = await request.get('/api/test/user')
      expect(err).toBeFalsy();
      expect(res.body.err).toBeTruthy();
      done();
    });
  });
  it('given login with auto login', async () => {
    userf.login('user1', true, done);
  });
  it('access should work', async () => {
    const res = await request.get('/api/test/user')
      expect(err).toBeFalsy();
      expect(res.body.err).toBeFalsy();
      done();
    });
  });
  it('given new session', async () => {
    const res = await request.post('/api/destroy-session')
      expect(err).toBeFalsy();
      expect(res.body.err).toBeFalsy();
      done();
    });
  });
  it('access should work', async () => {
    const res = await request.get('/api/test/user')
      expect(err).toBeFalsy();
      expect(res.body.err).toBeFalsy();
      done();
    });
  });
  it('given logged out', async () => {
    userf.logout(done);
  });
  it('access should fail', async () => {
    const res = await request.get('/api/test/user')
      expect(err).toBeFalsy();
      expect(res.body.err).toBeTruthy();
      done();
    })
  });
});

describe('auto login with invalid email', () => {
  it('given new (cookie clean) Agent', () => {
    expl.newAgent();
  });
  it('access should fail', async () => {
    const res = await request.get('/api/test/user')
      expect(err).toBeFalsy();
      expect(res.body.err).toBeTruthy();
      done();
    });
  });
  it('given login with auto login', async () => {
    userf.login('user1', true, done);
  });
  it('access should work', async () => {
    const res = await request.get('/api/test/user')
      expect(err).toBeFalsy();
      expect(res.body.err).toBeFalsy();
      done();
    });
  });
  it('cookie should be filled', async () => {
    const res = await request.get('/api/cookies')
      expect(err).toBeFalsy();
      expect(res.body.err).toBeFalsy();
      expect(res.body.email).toBe(userf.users.user1.email);
      done();
    });
  });
  it('given email changed', async () => {
    const fields = {
      $set: {
        email: 'new@def.com'
      }
    };
    db.query('update user set email = "new@def.com" where id = ?', userf.users.user1.id, (err, r) => {
      expect(err).toBeFalsy();
      expect(r.changedRows).toBe(1);
      done();
    });
  });
  it('given new session', async () => {
    const res = await request.post('/api/destroy-session')
      expect(err).toBeFalsy();
      expect(res.body.err).toBeFalsy();
      done();
    });
  });
  it('should fail', async () => {
    const res = await request.get('/api/test/user')
      expect(err).toBeFalsy();
      expect(res.body.err).toBeTruthy();
      done();
    });
  });
  it('cookie should be destroied', async () => {
    const res = await request.get('/api/cookies')
      expect(err).toBeFalsy();
      expect(res.body.err).toBeFalsy();
      expect(res.body.email).toBe(undefined);
      done();
    });
  });
});

describe('redirecting to login page', () => {
  it('given handler', async () => {
    server.router.get('/test/public', function (req, res, done) {
      res.send('public');
    });
    server.router.get('/test/private', function (req, res, done) {
      usera.getSessionUser(res, function (err, user) {
        if (err) return done(err);
        res.send('private');
      })
    });
    done();
  });
  it('public should work', async () => {
    const res = await request.get('/test/public')
      expect(err).toBeFalsy();
      expect(res.text).toBe('public');
      done();
    });
  });
  it('private should work', async () => {
    const res = await request.get('/test/private').redirects(0)
      expect(err).toBeTruthy();
      assert2.redirect(res, '/user/login');
      done();
    });
  });
});
