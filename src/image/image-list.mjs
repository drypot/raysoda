import * as async2 from "../base/async.mjs";
import * as date2 from "../base/date.mjs";
import * as error from "../base/error.mjs";
import * as config from "../base/config.mjs";
import * as url2 from "../base/url.mjs";
import * as db from '../db/db.mjs';
import * as expb from "../express/express-base.mjs";
import * as userb from "../user/user-base.mjs";
import * as imageb from "../image/image-base.mjs";
import * as bannerb from "../banner/banner-base.mjs";

expb.router.get('/', function (req, res, done) {
  list(req, res, false, done);
});

expb.router.get('/images', function (req, res, done) {
  list(req, res, false, done);
});

expb.router.get('/api/images', function (req, res, done) {
  list(req, res, true, done);
});

function list(req, res, api, done) {
  let p = Math.max(parseInt(req.query.p) || 1, 1);
  let ps = Math.min(Math.max(parseInt(req.query.ps) || 16, 1), 128);
  let dstr = req.query.d;
  let d = null;
  if (dstr) {
    d = new Date(dstr.slice(0, 4), dstr.slice(4,6));
  }
  async2.waterfall(
    (done) => {
      if (d) {
        db.query('select * from image where cdate < ? order by cdate desc limit ?, ?', [d, (p-1)*ps, ps], done);
      } else {
        db.query('select * from image order by cdate desc limit ?, ?', [(p-1)*ps, ps], done);
      }
    },
    (err, images) => {
      if (err) return done(err);
      decoImageList(images, (err) => {
        if (err) return done(err);
        if (api) {
          res.json({
            images: images
          });
        } else {
          res.render('image/image-list', {
            images: images,
            prev: p > 1 ? new url2.UrlMaker('/images').add('d', dstr).add('p', p - 1, 1).add('ps', ps, 16).gen() : undefined,
            next: images.length === ps ? new url2.UrlMaker('/images').add('d', dstr).add('p', p + 1).add('ps', ps, 16).gen(): undefined,
            banners: bannerb.banners,
          });
        }
      });
    }
  );
}

export function decoImageList(images, done) {
  let i = 0;
  (function loop() {
    if (i === images.length) {
      return done(null);
    }
    let image = images[i++];
    imageb.unpackImage(image);
    userb.getCached(image.uid, function (err, user) {
      if (err) return done(err);
      image.user = {
        id: user.id,
        name: user.name,
        home: user.home
      };
      image.thumb = imageb.fman.getThumbUrl(image.id);
      image.cdateStr = date2.genDateTimeString(image.cdate);
      setImmediate(loop);
    });
  })();
}
