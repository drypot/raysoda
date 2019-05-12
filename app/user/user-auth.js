'use strict';

const init = require('../base/init');
const error = require('../base/error');
const config = require('../base/config');
const my2 = require('../mysql/my2');
const expb = require('../express/express-base');
const userb = require('../user/user-base');
var usera = exports;

// set-admin.js 등, express 가 필요없는 모듈에서 user-base 를 쓸 수 있도록 auth 부분을 분리한다.

// authentication

usera.checkUser = function (res, done) {
  var user = res.locals.user;
  if (!user) {
    return done(error('NOT_AUTHENTICATED'));
  }
  done(null, user);
};

usera.checkAdmin = function (res, done) {
  var user = res.locals.user;
  if (!user) {
    return done(error('NOT_AUTHENTICATED'));
  }
  if (!user.admin) {
    return done(error('NOT_AUTHORIZED'));
  }
  done(null, user);
};

usera.checkUpdatable = function (user, id, done) {
  if (user.id != id && !user.admin) {
    return done(error('NOT_AUTHORIZED'))
  }
  done();
};

// login

expb.redirectToLogin = function (err, req, res, done) {
  if (!res.locals.api && err.code == error.NOT_AUTHENTICATED.code) {
    res.redirect('/users/login');
  } else {
    done(err);
  }
};

expb.core.get('/users/login', function (req, res, done) {
  res.render('user/user-auth-login');
});

expb.core.post('/api/users/login', function (req, res, done) {
  var form = {};
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

expb.autoLogin = function (req, res, done) {
  if (req.session.uid) {
    userb.getCached(req.session.uid, function (err, user) {
      if (err) return req.session.regenerate(done);
      res.locals.user = user;
      done();
    });
    return;
  }
  var email = req.cookies.email;
  var password = req.cookies.password;
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
};

function createSession(req, res, user, done) {
  req.session.regenerate(function (err) {
    if (err) return done(err);
    var now = new Date();
    my2.query('update user set adate = ? where id = ?', [now, user.id], (err, r) => {
      if (err) return done(err);
      user.adate = now;
      req.session.uid = user.id;
      res.locals.user = user;
      done(null, user);
    });
  });
}

function findUser(email, password, done) {
  my2.queryOne('select * from user where email = ?', email, (err, user) => {
    if (err) return done(err);
    if (!user) {
      return done(error('EMAIL_NOT_FOUND'));
    }
    userb.unpackUser(user);
    if (user.status == 'd') {
      return done(error('ACCOUNT_DEACTIVATED'));
    }    
    userb.checkPassword(password, user.hash, function (err, matched) {
      if (!matched) {      
        return done(error('PASSWORD_WRONG'));
      }
      userb.cache(user);    
      done(null, user);
    });
  });
};

expb.core.get('/api/users/login', function (req, res, done) {
  usera.checkUser(res, function (err, user) {
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
  usera.logout(req, res);
  res.json({});
});

usera.logout = function (req, res, done) {
  res.clearCookie('email');
  res.clearCookie('password');
  req.session.destroy();
};
