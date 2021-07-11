import * as async2 from "../base/async.mjs";
import * as date2 from "../base/date.mjs";
import * as url2 from "../base/url.mjs";
import * as db from '../db/db.mjs';
import * as expb from '../express/express-base.mjs';
import * as userb from '../user/user-base.mjs';
import * as imageb from '../image/image-base.mjs';
import * as imagel from '../image/image-list.mjs';

expb.router.get('/users/:id([0-9]+)', function (req, res, done) {
  const id = parseInt(req.params.id) || 0;
  userb.getCached(id, function (err, tuser) {
    if (err) return done(err);
    list(req, res, tuser, done);
  });
});

expb.router.get('/:name([^/]+)', function (req, res, done) {
  const home = decodeURIComponent(req.params.name);
  userb.getCachedByHome(home, function (err, tuser) {
    if (err) return done(err);
    if (!tuser) return done();
    list(req, res, tuser, done);
  });
});

function list(req, res, tuser, done) {
  const user = res.locals.user;
  const p = Math.max(parseInt(req.query.p) || 1, 1);
  const ps = Math.min(Math.max(parseInt(req.query.ps) || 16, 1), 128);
  db.query('select * from image where uid = ? order by cdate desc limit ?, ?', [tuser.id, (p-1)*ps, ps], (err, images) => {
    if (err) return done(err);
    imagel.decoImageList(images, (err) => {
      if (err) return done(err);
      res.render('userx/userx-view', {
        tuser: tuser,
        updatable: user && (user.id === tuser.id || user.admin),
        images: images,
        prev: p > 1 ? new url2.UrlMaker(req.path).add('p', p - 1, 1).add('ps', ps, 16).gen() : undefined,
        next: images.length === ps ? new url2.UrlMaker(req.path).add('p', p + 1).add('ps', ps, 16).gen() : undefined,
        path: req.path,
      });
    });
  });
}
