'use strict';

const tds = require('tedious');

const init = require('../base/init');
const config = require('../base/config');

/* 
  $ node app/mig-raysoda/mig-test-sql.js -c config/mig-1-dev.json 
*/

init.main(function (done) {
  var conn = new tds.Connection(config.sql);
  conn.on('connect', function (err) {
    if (err) return done(err);
    var req = new tds.Request('select top 1 * from users', function (err, c) {
      if (err) return done(err);
      console.log(c + ' rows');
      done();
    });
    req.on('row', function (cs) {
      cs.forEach(function(c) {
        console.log(c.value);
      });
    });
    conn.execSql(req);
  });
});
