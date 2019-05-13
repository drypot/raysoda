'use strict';

const error = require('../base/error');
const my2 = require('../mysql/my2');
const expb = require('../express/express-base');
const userb = require('../user/user-base');
const usern = exports;

expb.core.get('/users/register', function (req, res, done) {
  res.render('user/user-new');
});

expb.core.post('/api/users', function (req, res, done) {
  var form = getForm(req);
  form.home = form.name;
  form.homel = form.namel = form.name.toLowerCase();
  checkForm(form, 0, function (err) {
    if (err) return done(err);
    userb.makeHash(form.password, function (err, hash) {
      if (err) return done(err);
      var user = userb.getNewUser();
      user.id = userb.getNewId();
      user.name = form.name;
      user.namel = form.namel;
      user.home = form.home;
      user.homel = form.homel;
      user.email = form.email;
      user.hash = hash;
      user.profile = form.profile;
      my2.query('insert into user set ?', user, (err) => {
        if (err) return done(err);
        res.json({
          id: user.id
        });
      });
    });
  });
});

usern.emailx = /^[a-z0-9-_+.]+@[a-z0-9-]+(\.[a-z0-9-]+)+$/i

var getForm = usern.getForm = function (req) {
  var body = req.body;
  var form = {};
  form.name = String(body.name || '').trim();
  form.home = String(body.home || '').trim();
  form.email = String(body.email || '').trim();
  form.password = String(body.password || '').trim();
  form.profile = String(body.profile || '').trim();
  return form;
}

var checkForm = usern.checkForm = function (form, id, done) {
  var errors = [];
  var creating = id == 0;

  if (!form.name.length) {
    errors.push(error.NAME_EMPTY);
  } else if (form.name.length > 32) {
    errors.push(error.NAME_RANGE);
  }

  if (!form.home.length) {
    errors.push(error.HOME_EMPTY);
  } else if (form.home.length > 32) {
    errors.push(error.HOME_RANGE);
  }

  checkFormEmail(form, errors);

  if (creating || form.password.length) {
    checkFormPassword(form, errors);
  }

  userExistsWithSameName(form.namel, id, function (err, exist) {
    if (err) return done(err);
    if (exist) {
      errors.push(error.NAME_DUPE);
    }
    userExistsWithSameName(form.homel, id, function (err, exist) {
      if (err) return done(err);
      if (exist) {
        errors.push(error.HOME_DUPE);
      }
      userExistsWithSameEmail(form.email, id, function (err, exist) {
        if (err) return done(err);
        if (exist) {
          errors.push(error.EMAIL_DUPE);
        }
        if (errors.length) {
          done(error(errors));
        } else {
          done();
        }
      });
    });
  });
}

var checkFormEmail = usern.checkFormEmail = function (form, errors) {
  if (!form.email.length) {
    errors.push(error.EMAIL_EMPTY);
  } else if (form.email.length > 64 || form.email.length < 8) {
    errors.push(error.EMAIL_RANGE);
  } else if (!usern.emailx.test(form.email)) {
    errors.push(error.EMAIL_PATTERN);
  }
}

var checkFormPassword = usern.checkFormPassword = function (form, errors) {
  if (!form.password.length) {
    errors.push(error.PASSWORD_EMPTY);
  } else if (form.password.length > 32 || form.password.length < 4) {
    errors.push(error.PASSWORD_RANGE);
  }
}

function userExistsWithSameName(namel, id, done) {
  my2.queryOne(
    'select exists(select * from user where (namel = ? or homel = ?) and id != ?) as exist',
    [namel, namel, id],
    (err, r) => {
      done(err, r.exist === 1)
    }
  );
};

function userExistsWithSameEmail(email, id, done) {
  my2.queryOne(
    'select exists(select * from user where email = ? and id != ?) as exist',
    [email, id],
    (err, r) => {
      done(err, r.exist === 1)
    }
  );
};
