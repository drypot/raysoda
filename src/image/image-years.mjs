import * as assert2 from "../base/assert2.mjs";
import * as init from "../base/init.mjs";
import * as db from '../db/db.mjs';
import * as expb from '../express/express-base.mjs';
import * as imageb from '../image/image-base.mjs';

let first;

init.add(
  (done) => {
    db.queryOne('select * from image order by cdate limit 1', (err, image) => {
      if (err) return done(err);
      first = image ? image.cdate : new Date();
      done();
    });
  }
);

expb.core.get('/images/years', function (req, res, done) {
  res.render('image/image-years', {
    today: new Date(),
    first: first
  });
});
