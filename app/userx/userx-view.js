'use strict';

const async = require('../base/async');
const url2 = require('../base/url2');
const date2 = require('../base/date2');
const my2 = require('../mysql/my2');
const expb = require('../express/express-base');
const userb = require('../user/user-base');
const imageb = require('../image/image-base');
const imagel = require('../image/image-list');

expb.core.get('/users/:id([0-9]+)', function (req, res, done) {
  var id = parseInt(req.params.id) || 0;
  userb.getCached(id, function (err, tuser) {
    if (err) return done(err);
    list(req, res, tuser);
  });
});

expb.core.get('/:name([^/]+)', function (req, res, done) {
  var home = decodeURIComponent(req.params.name);
  userb.getCachedByHome(home, function (err, tuser) {
    if (err) return done(err);
    if (!tuser) return done();
    list(req, res, tuser);
  });
});

function list(req, res, tuser) {
  var user = res.locals.user;
  var p = Math.max(parseInt(req.query.p) || 1, 1);
  var ps = Math.min(Math.max(parseInt(req.query.ps) || 16, 1), 128);
  my2.query('select * from image where uid = ? order by id desc limit ?, ?', [tuser.id, (p-1)*ps, ps], (err, images) => {
    if (err) return done(err);
    imagel.decoImageList(images, (err) => {
      if (err) return done(err);
      res.render('userx/userx-view', {
        tuser: tuser,
        updatable: user && (user.id === tuser.id || user.admin),
        images: images,
        prev: p > 1 ? new url2.UrlMaker(req.path).add('p', p - 1, 1).add('ps', ps, 16).done() : undefined,
        next: new url2.UrlMaker(req.path).add('p', p + 1).add('ps', ps, 16).done(),
        path: req.path,
      });
    });
  });
}