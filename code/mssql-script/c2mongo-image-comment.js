'use strict';

const tds = require('tedious');
const types = tds.TYPES;
const init = require('../base/init');
const config = require('../base/config');
const mongo2 = require('../mongodb/mongo2');
const imageb = require('../image/image-base');

/*
  사진 코멘트 부분을 추가적으로 변경하는 것이 좋겠다.

  $ node code/mig-raysoda/mig-image-comment.js -c config/mig-1-dev.json 1 10
*/

init.main(function (done) {
  if (config.argv._.length != 2) {
    console.log('Start and end ids should be specified.');
    return done();
  }
  var conn = new tds.Connection(config.sql);
  conn.on('connect', function (err) {
    if (err) return done(err);
    var s = config.argv._[0];
    var e = config.argv._[1];
    var cnt = 0;
    var req = new tds.Request('select PhotoID, Title, Comment from Photos where PhotoID between @s and @e order by PhotoID', function (err, c) {
      if (err) return done(err);
      console.log(c + ' sql rows read');
      done();
    });
    req.addParameter('s', types.Int, s);
    req.addParameter('e', types.Int, e);
    req.on('row', function (cs) {
      var _id = cs[0].value;
      var title = cs[1].value;
      var comment = cs[2].value;
      if (title) {
        if (title == comment) {
          imageb.images.updateOne({ _id: _id, comment: title + '\n\n' + comment }, { $set: { comment : comment } }, function (err) {
            if (err) return done(err);
            cnt++;
            if (cnt % 100 == 0) {
              console.log(_id);
            }
          });
        }
      }
    });
    conn.execSql(req);
  });
  conn.on('error', function(err) {
    done(err);
  });
});

