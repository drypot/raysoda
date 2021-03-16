import * as assert2 from "../base/assert2.js";
import * as error from "../base/error.js";
import * as db from '../db/db.js';
import * as expb from "../express/express-base.js";
import * as userb from "../user/user-base.js";

// set-admin.js 등, express 가 필요없는 모듈에서 user-base 를 쓸 수 있도록 auth 부분을 분리한다.

// authentication

export function checkUser(res, done) {
  const user = res.locals.user;
  if (!user) {
    return done(error.newError('NOT_AUTHENTICATED'));
  }
  done(null, user);
}

export function checkAdmin(res, done) {
  const user = res.locals.user;
  if (!user) {
    return done(error.newError('NOT_AUTHENTICATED'));
  }
  if (!user.admin) {
    return done(error.newError('NOT_AUTHORIZED'));
  }
  done(null, user);
}

export function checkUpdatable(user, id, done) {
  if (user.id !== id && !user.admin) {
    return done(error.newError('NOT_AUTHORIZED'))
  }
  done();
}

// login

expb.setRedirectToLogin(function (err, req, res, done) {
  if (!res.locals.api && err.code === error.get('NOT_AUTHENTICATED').code) {
    res.redirect('/users/login');
  } else {
    done(err);
  }
});

expb.core.get('/users/login', function (req, res, done) {
  res.render('user/user-auth-login');
});

expb.core.post('/api/users/login', function (req, res, done) {
  const form = {};
  form.email = String(req.body.email || '').trim();
  form.password = String(req.body.password || '').trim();
  form.remember = !!req.body.remember;
  findUser(form.email, form.password, function (err, user) {
    if (err) return done(err);
    if (form.remember) {
      res.cookie('email', form.email, {
        maxAge: 99 * 365 * 24 * 60 * 60 * 1000,
        httpOnly: true
      });
      res.cookie('password', form.password, {
        maxAge: 99 * 365 * 24 * 60 * 60 * 1000,
        httpOnly: true
      });
    }
    createSession(req, res, user, function (err, user) {
      if (err) return done(err);
      res.json({
        user: {
          id: user.id,
          name: user.name
        }
      });
    });
  });
});

expb.setAutoLogin(function (req, res, done) {
  if (req.session.uid) {
    userb.getCached(req.session.uid, function (err, user) {
      if (err) return req.session.regenerate(done);
      res.locals.user = user;
      done();
    });
    return;
  }
  const email = req.cookies.email;
  const password = req.cookies.password;
  if (!email || !password) {
    return done();
  }
  findUser(email, password, function (err, user) {
    if (err) {
      res.clearCookie('email');
      res.clearCookie('password');
      return done();
    }
    createSession(req, res, user, done);
  });
});

function createSession(req, res, user, done) {
  req.session.regenerate(function (err) {
    if (err) return done(err);
    const now = new Date();
    db.query('update user set adate = ? where id = ?', [now, user.id], (err, r) => {
      if (err) return done(err);
      user.adate = now;
      req.session.uid = user.id;
      res.locals.user = user;
      done(null, user);
    });
  });
}

function findUser(email, password, done) {
  db.queryOne('select * from user where email = ?', email, (err, user) => {
    if (err) return done(err);
    if (!user) {
      return done(error.newError('EMAIL_NOT_FOUND'));
    }
    userb.unpackUser(user);
    if (user.status === 'd') {
      return done(error.newError('ACCOUNT_DEACTIVATED'));
    }
    userb.checkPassword(password, user.hash, function (err, matched) {
      if (!matched) {
        return done(error.newError('PASSWORD_WRONG'));
      }
      userb.cache(user);
      done(null, user);
    });
  });
}

expb.core.get('/api/users/login', function (req, res, done) {
  checkUser(res, function (err, user) {
    if (err) return done(err);
    res.json({
      user: {
        id: user.id,
        name: user.name
      }
    });
  });
});

// logout

expb.core.post('/api/users/logout', function (req, res, done) {
  logout(req, res);
  res.json({});
});

export function logout(req, res, done) {
  res.clearCookie('email');
  res.clearCookie('password');
  req.session.destroy();
}
