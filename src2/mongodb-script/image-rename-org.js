'use strict';

const fs = require('fs');
const init = require('../base/init');
const config = require('../base/config')({ parseArg: true });
const mongo2 = require('../mongodb/mongo2');
import * as imageb from '../image/image-base.js';

init.run(function (err) {
  if (err) throw err;
  console.log('start.');
  var cursor = imageb.images.find();
  function read() {
    cursor.nextObject(function (err, image) {
      if (err) return done(err);
      if (!image) return done();
      var dir = new imageb.fman.getDir(image._id);
      var oname = dir + '/' + image._id + '.' + image.format;
      var nname = dir + '/' + image._id + '-org.' + image.format;
      //console.log(oname + ' -> ' + nname);
      fs.renameSync(oname, nname);
      setImmediate(read);
    });
  }
  function done() {
    console.log('done.');
    mongo2.db.close();
  }
  read();
});
