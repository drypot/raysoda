
const tds = require('tedious');
import * as init from "../base/init.js";
import * as config from "../base/config.js";

/*
  $ node code/mig-raysoda/mig-test-sql.js -c config/mig-1-dev.json
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
