import * as assert2 from "../base/assert2.mjs";
import * as error from "../base/error.mjs";
import * as async2 from "../base/async2.mjs";
import * as expb from "../express/express-base.mjs";
import * as db from '../db/db.mjs';
import * as userb from "../user/user-base.mjs";
import * as usera from "../user/user-auth.mjs";
import * as usern from "../user/user-new.mjs";

expb.core.get('/users/:id([0-9]+)/update', function (req, res, done) {
  usera.checkUser(res, function (err, user) {
    if (err) return done(err);
    const id = parseInt(req.params.id) || 0;
    usera.checkUpdatable(user, id, function (err) {
      if (err) return done(err);
      userb.getCached(id, function (err, tuser) {
        if (err) return done(err);
        res.render('user/user-update', {
          tuser: tuser
        });
      });
    });
  });
});

expb.core.put('/api/users/:id([0-9]+)', function (req, res, done) {
  usera.checkUser(res, function (err, user) {
    if (err) return done(err);
    const id = parseInt(req.params.id) || 0;
    const form = usern.getForm(req);
    usera.checkUpdatable(user, id, function (err) {
      if (err) return done(err);
      usern.checkForm(form, id, function (err) {
        if (err) return done(err);
        let fields = {
          name: form.name,
          home: form.home,
          email: form.email,
          profile: form.profile
        };
        async2.waterfall(
          (done) => {
            if (form.password.length) {
              userb.makeHash(form.password, done)
            } else {
              done();
            }
          },
          (err, hash) => {
            if (hash) {
              fields.hash = hash;
            }
            db.query('update user set ? where id = ?', [fields, id], (err, r) => {
              if (err) return done(err);
              // 수정 없이 Submit 한 경우에 에러를 내서 Comment Out 하였다.
              // if (!r.changedRows) {
              //   return done(error.newError('USER_NOT_FOUND'));
              // }
              userb.deleteCache(id);
              res.json({});
            });
          }
        );
      });
    });
  });
});
