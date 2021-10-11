'use strict';

const init = require('../base/init');
const error = require('../base/error');
const config = require('../base/config');
const mongo2 = require('../mongodb/mongo2');
import * as userb from '../user/user-base.js';

/*
  $ node src/user-script/set-admin.js -c config/raysoda-live.json 'admin@gmail.com'
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
