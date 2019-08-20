'use strict';

const init = require('../base/init');
const config = require('../base/config');
const mongo2 = require('../mongodb/mongo2');
const userb = require('../user/user-base');

init.run(function (err) {
  mongo2.forEach(userb.users, function (user, done) {
    if (!user.namel) {
      process.stdout.write(user.id + 'u ');
      var fields = {};
      if (!user.home) {
        user.home = user.name;
        fields.home = user.home;
      }
      fields.namel = user.name.toLowerCase();
      fields.homel = user.home.toLowerCase();
      return userb.users.updateOne({ _id: user.id }, { $set: fields }, done);
    }
    process.stdout.write(user.id + 's ');
    done();
  }, function (err) {
    if (err) throw err;
    console.log('done');
    mongo2.db.close();
  });
});
