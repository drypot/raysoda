'use strict';

var init = require('../base/init');
var error = require('../base/error');
var config = require('../base/config');
var mongo2 = require('../mongo/mongo2');
var userb = require('../user/user-base');

/*
  $ node server/user-script/set-admin.js -c config/raysoda-live.json 'admin@gmail.com'
*/

init.add(function (done) {
  if (config.argv._.length < 1) {
    console.log('\nspecify email.');
    return done();
  }
  userb.users.updateOne({ email: config.argv._[0] }, { $set: { admin: true } }, function (err, r) {
    if (err) return done(err);
    if (!r.matchedCount) {
      console.log('user not found');
      return done();
    }
    done();
  });
});

init.run(function (err) {
  mongo2.db.close();
  if (err) throw err;
});
