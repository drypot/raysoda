import * as assert2 from "../base/assert2.js";
import * as url2 from "../base/url2.js";
import * as expb from "../express/express-base.js";
import * as db from '../db/db.js';
import * as usera from "../user/user-auth.js";

expb.core.get('/users', function (req, res, done) {
  list(req, res, false, done);
});

expb.core.get('/api/users', function (req, res, done) {
  list(req, res, true, done);
});

function list(req, res, api, done) {
  let p = Math.max(parseInt(req.query.p) || 1, 1);
  let ps = Math.min(Math.max(parseInt(req.query.ps) || 99, 1), 300);
  let offset = (p-1)*ps;
  let q = req.query.q || '';
  let sql;
  let sqlParam;
  let admin = res.locals.user && res.locals.user.admin;
  if (q.length) {
    if (admin) {
      sql = 'select id, name, home from user where name = ? or home = ? or email = ? limit ?, ?';
      sqlParam =[q, q, q, offset, ps];
    } else {
      sql = 'select id, name, home from user where name = ? or home = ? limit ?, ?';
      sqlParam =[q, q, offset, ps];
    }
  } else {
    sql = 'select id, name, home from user order by pdate desc limit ?, ?';
    sqlParam =[offset, ps];
  }
  db.query(sql, sqlParam, (err, users) => {
    if (err) return done(err);
    if (api) {
      res.json({
        users: users,
      });
    } else {
      res.render('user/user-list', {
        users: users,
        prev: p > 1 ? new url2.UrlMaker('/users').add('p', p - 1, 1).add('ps', ps, 99).done() : undefined,
        next: users.length === ps ? new url2.UrlMaker('/users').add('p', p + 1).add('ps', ps, 99).done(): undefined,
      });
    }
  });
}
