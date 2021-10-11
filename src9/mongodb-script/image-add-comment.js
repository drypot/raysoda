'use strict';

const init = require('../base/init');
const config = require('../base/config');
const mongo2 = require('../mongodb/mongo2');
import * as imageb from '../image/image-base.js';

init.run(function (err) {
  var col = imageb.images
  mongo2.forEach(col, function (obj, done) {
    if (obj.comment == undefined) {
      process.stdout.write(obj._id + 'u ');
      var fields = {};
      fields.comment = '';
      return col.updateOne({ _id: obj._id }, { $set: fields }, done);
    }
    process.stdout.write(obj._id + 's ');
    done();
  }, function (err) {
    if (err) throw err;
    console.log('done');
    mongo2.db.close();
  });
});
