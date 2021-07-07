import * as assert2 from "../base/assert2.mjs";
import * as error from "../base/error.mjs";
import * as expb from "../express/express-base.mjs";
import * as db from '../db/db.mjs';
import * as usera from "../user/user-auth.mjs";
import * as userb from "../user/user-base.mjs";

expb.core.delete('/api/users/:id([0-9]+)', function (req, res, done) {
  usera.checkUser(res, function (err, user) {
    if (err) return done(err);
    const id = parseInt(req.params.id) || 0;
    usera.checkUpdatable(user, id, function (err) {
      if (err) return done(err);
      db.query('update user set status = "d" where id = ?', id, (err, r) => {
        if (err) return done(err);
        if (!r.changedRows) {
          return done(error.newError('USER_NOT_FOUND'));
        }
        userb.deleteCache(id);
        if (user.id === id) {
          usera.logout(req, res);
        }
        res.json({});
      });
    });
  });
});

expb.core.get('/users/deactivate', function (req, res, done) {
  usera.checkUser(res, function (err, user) {
    if (err) return done(err);
    res.render('user/user-deactivate');
  });
});
