'use strict';

const init = require('../base/init');
const error = require('../base/error');
const config = require('../base/config');
const mongo2 = require('../mongo/mongo2');
const userb = require('../user/user-base');

/*
  $ node app/user-script/set-admin.js -c config/raysoda-live.json 'admin@gmail.com'
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
