import * as assert2 from "../base/assert2.js";
import * as error from "../base/error.js";
import * as db from '../db/db.js';
import * as expb from "../express/express-base.js";
import * as userb from "../user/user-base.js";

expb.core.get('/users/register', function (req, res, done) {
  res.render('user/user-new');
});

expb.core.get('/users/register-done', function (req, res, done) {
  res.render('user/user-new-done');
});

expb.core.post('/api/users', function (req, res, done) {
  const form = getForm(req);
  form.home = form.name;
  checkForm(form, 0, function (err) {
    if (err) return done(err);
    userb.makeHash(form.password, function (err, hash) {
      if (err) return done(err);
      const user = userb.getNewUser();
      user.id = userb.getNewId();
      user.name = form.name;
      user.home = form.home;
      user.email = form.email;
      user.hash = hash;
      user.profile = form.profile;
      db.query('insert into user set ?', user, (err) => {
        if (err) return done(err);
        res.json({
          id: user.id
        });
      });
    });
  });
});

export const emailx = /^[a-z0-9-_+.]+@[a-z0-9-]+(\.[a-z0-9-]+)+$/i

export function getForm(req) {
  const body = req.body;
  const form = {};
  form.name = String(body.name || '').trim();
  form.home = String(body.home || '').trim();
  form.email = String(body.email || '').trim();
  form.password = String(body.password || '').trim();
  form.profile = String(body.profile || '').trim();
  return form;
}

export function checkForm(form, id, done) {
  const errors = [];
  const creating = id === 0;

  if (!form.name.length) {
    errors.push(error.get('NAME_EMPTY'));
  } else if (form.name.length > 32) {
    errors.push(error.get('NAME_RANGE'));
  }

  if (!form.home.length) {
    errors.push(error.get('HOME_EMPTY'));
  } else if (form.home.length > 32) {
    errors.push(error.get('HOME_RANGE'));
  }

  checkFormEmail(form, errors);

  if (creating || form.password.length) {
    checkFormPassword(form, errors);
  }

  userExistsWithSameName(form.name, id, function (err, exist) {
    if (err) return done(err);
    if (exist) {
      errors.push(error.get('NAME_DUPE'));
    }
    userExistsWithSameName(form.home, id, function (err, exist) {
      if (err) return done(err);
      if (exist) {
        errors.push(error.get('HOME_DUPE'));
      }
      userExistsWithSameEmail(form.email, id, function (err, exist) {
        if (err) return done(err);
        if (exist) {
          errors.push(error.get('EMAIL_DUPE'));
        }
        if (errors.length) {
          done(error.newFormError(errors));
        } else {
          done();
        }
      });
    });
  });
}

export function checkFormEmail(form, errors) {
  if (!form.email.length) {
    errors.push(error.get('EMAIL_EMPTY'));
  } else if (form.email.length > 64 || form.email.length < 8) {
    errors.push(error.get('EMAIL_RANGE'));
  } else if (!emailx.test(form.email)) {
    errors.push(error.get('EMAIL_PATTERN'));
  }
}

export function checkFormPassword(form, errors) {
  if (!form.password.length) {
    errors.push(error.get('PASSWORD_EMPTY'));
  } else if (form.password.length > 32 || form.password.length < 4) {
    errors.push(error.get('PASSWORD_RANGE'));
  }
}

function userExistsWithSameName(name, id, done) {
  db.queryOne(
    'select exists(select * from user where (name = ? or home = ?) and id != ?) as exist',
    [name, name, id],
    (err, r) => {
      done(err, r.exist === 1)
    }
  );
}

function userExistsWithSameEmail(email, id, done) {
  db.queryOne(
    'select exists(select * from user where email = ? and id != ?) as exist',
    [email, id],
    (err, r) => {
      done(err, r.exist === 1)
    }
  );
}
