'use strict';

var init = require('../base/init');
var config = require('../base/config');
var mongo2 = require('../mongo/mongo2');
var imageb = require('../image/image-base');

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
