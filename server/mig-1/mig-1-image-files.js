var init = require('../base/init');
var config = require('../base/config');
var imageb = require('../image/image-base');
var fs = require('fs');
var fs2 = require('../base/fs2');
var tds = require('tedious');
var types = tds.TYPES;

/* 
  $ node server/mig-1/mig-1-image-files.js -c config/mig-1-dev.json 1 10
*/

init.main(function (done) {
  if (config.argv._.length != 2) {
    console.log('Start and end PhotoIDs should be specified.');
    return done();
  }
  var conn = new tds.Connection(config.sql);
  conn.on('connect', function (err) {
    if (err) return done(err);
    var photos = [];
    var s = config.argv._[0];
    var e = config.argv._[1];
    var req = new tds.Request('select photoid, userid from photos where photoid between @s and @e order by photoid', function (err, c) {
      if (err) return done(err);
      console.log(c + ' sql rows read');
      console.log('file copy starts');
      var i = s;
      (function loop() {
        if (i > e) {
          console.log('file copy done');
          return done();
        }
        var pid = i;
        var uid = photos[i];
        i++;
        if (uid) {
          copyFile(pid, uid, function (err) {
            if (err) return done(err);
            setImmediate(loop);
          });
        } else {
          setImmediate(loop);
        }
      })();
    });
    req.addParameter('s', types.Int, s);
    req.addParameter('e', types.Int, e);
    req.on('row', function (cs) {
      photos[cs[0].value] = cs[1].value;
    });
    conn.execSql(req);
  });
  conn.on('error', function(err) {
    done(err);
  });
});

var cpcnt = 0;

function copyFile(pid, uid, done) {
  var sdir = config.srcDir + '/' + uid + '/PP/' + pid;
  fs.readdir(sdir, function (err, files) {
    if (err) {
      if (err.code == 'ENOENT') {
        console.log('dir not exist: ' + sdir);
        return done();
      } 
      return done(err);
    }
    if (!files.length) {
      console.log('no file in dir: ' + sdir);
      return done();
    }
    var spath = sdir + '/' + files[0];
    var tar = new imageb.FilePath(pid);
    // console.log('src: ' + spath);
    // console.log('tar: ' + tar.path);
    fs2.makeDir(tar.dir, function (err) {
      if (err) return done(err);
      fs2.copy(spath, tar.path, function (err) {
        if (err) {
          console.log('copy err: cp ' + spath + ' ' + tar.path);
        }
        cpcnt++;
        if (cpcnt % 100 == 0) {
          console.log('copied: ' + pid);
        }
        done(err);
      });
    });
  });
}
