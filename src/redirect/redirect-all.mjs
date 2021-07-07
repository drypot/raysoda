import * as assert2 from "../base/assert2.mjs";
import * as expb from "../express/express-base.mjs";

/* redirects for raysoda v1 */

expb.core.get('/Com/Photo/View.aspx', function (req, res, done) {
  res.redirect(301, '/images/' + req.query.p);
});

expb.core.get('/Com/Photo/List.aspx', function (req, res, done) {
  if (req.query.u) {
    res.redirect(301, '/users/' + req.query.u);
  } else {
    res.redirect(301, '/');
  }
});

expb.core.get('/Com/Photo/CList.aspx', function (req, res, done) {
  res.redirect(301, '/');
});

expb.core.get('/user/:id([0-9]+)', function (req, res, done) {
  res.redirect(301, '/users/' + req.params.id);
});
