'use strict';

const init = require('../base/init');
const my2 = require('../mysql/my2');
const expb = require('../express/express-base');
const imageb = require('../image/image-base');

var first;

init.add(
  (done) => {
    my2.queryOne('select * from image order by cdate limit 1', (err, image) => {
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
