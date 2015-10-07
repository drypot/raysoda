var init = require('../base/init');
var config = require('../base/config');
var expb = require('../express/express-base');
var usera = require('../user/user-auth');
var counterb = require('../counter/counter-base');

// expb.core.get('/supp/banners', function (req, res, done) {
//   usera.checkAdmin(res, function (err, user) {
//     if (err) return done(err);
//     res.render('banner/banner-update', {
//       banners: bannerb.banners
//     });
//   });
// });

expb.core.get('/api/counters/:id/inc', function (req, res, done) {
  counterb.updateDaily(req.params.id, function (err) {
    if (err) return done(err);
    res.redirect(req.query.r);
  })
});
