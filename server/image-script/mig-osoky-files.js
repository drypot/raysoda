var exec = require('child_process').exec;
var fs = require('fs');

var init = require('../base/init');
var config = require('../base/config');
var fs2 = require('../base/fs2');
var mongo2 = require('../base/mongo2');
var imageb = require('../image/image-base');

/* 
  먼저 public 디렉토리를 public-old 로 변경해 놓는다.
  구 디렉토리에서 새 디렉토리로 필요한 파일만 이동한다.

  $ node server/image-script/mig-osoky-files.js -c config/osoky-dev.json 1 10
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

var maxWidth = 1080;

function doIt(id, done) {
  var src = config.uploadDir + '/public-old/images/' + fs2.makeDeepPath(id, 3) + '/' + id + '-org.jpeg';
  fs.access(src, function (err) {
    if (err) return done();
    console.log(src);
    imageb.checkImageMeta(src, function (err, meta) {
      if (err) return done(err);
      fs2.makeDir(imageb.getDir(id), function (err) {
        if (err) return done(err);
        var shorter = meta.shorter * 299 / 320; // 구 버젼에선 (20 / 320) % 만큼 여백이 있었다. 이것을 깍아 삭제. 
        var max = shorter < maxWidth ? shorter : maxWidth;
        var r = (max - 1) / 2;
        var cmd = 'convert ' + src;
        cmd += ' -quality 92';
        cmd += ' -gravity center';
        cmd += ' -auto-orient';
        cmd += ' -crop ' + shorter + 'x' + shorter + '+0+0';
        cmd += ' +repage';
        cmd += ' -resize ' + max + 'x' + max + '\\>';
        cmd += ' \\( -size ' + max + 'x' + max + ' xc:black -fill white -draw "circle ' + r + ',' + r + ' ' + r + ',0" \\)'
        cmd += ' -alpha off -compose CopyOpacity -composite'
        //cmd += ' \\( +clone -alpha opaque -fill white -colorize 100% \\)'
        //cmd += ' +swap -geometry +0+0 -compose Over -composite -alpha off'
        cmd += ' -background white -alpha remove -alpha off'; // alpha remove need IM 6.7.5 or above
        cmd += ' ' + imageb.getPath(id);
        exec(cmd, function (err) {
          done(err, null);
        });
      });
    });
  });
}
