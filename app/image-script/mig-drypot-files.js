'use strict';

const exec = require('child_process').exec;
const fs = require('fs');
const tds = require('tedious');
var types = tds.TYPES;

const init = require('../base/init');
const config = require('../base/config');
const fs2 = require('../base/fs2');
const mongo2 = require('../mongodb/mongo2');
const imageb = require('../image/image-base');

/* 
  먼저 public 디렉토리를 public-old 로 변경해 놓는다.
  구 디렉토리에서 새 디렉토리로 필요한 파일만 이동한다.

  $ node app/image-script/mig-osoky-files.js -c config/drypot-dev.json 1 10
*/

init.main(function (done) {
  if (config.argv._.length != 2) {
    console.log('Start and end ids should be specified.');
    return done();
  }
  var s = parseInt(config.argv._[0]);
  var e = parseInt(config.argv._[1]);
  var i = s;
  (function loop() {
    if (i > e) {
      mongo2.db.close();
      return done();
    }
    doIt(i++, function (err) {
      if (err) return done(err);
      setImmediate(loop);
    });
  })();
});

function doIt(id, done) {
  var src = config.uploadDir + '/public-old/images/' + fs2.makeDeepPath(id, 3) + '/' + id + '-org.svg';
  fs.access(src, function (err) {
    if (err) return done();
    console.log(src);
    imageb.checkImageMeta(src, function (err, meta) {
      if (err) return done(err);
      imageb.saveImage(id, src, meta, done);
    });
  });
}
