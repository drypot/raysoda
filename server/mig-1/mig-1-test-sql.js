var init = require('../base/init');
var config = require('../base/config');
var sql = require('mssql');

/* 

  command example:

  $ node server/mig-1/mig-1-test-sql.js -c config/mig-1-dev.json 

*/

init.main(function (done) {
  sql.connect(config.sql, function(err) {
    if (err) return done(err);
    var request = new sql.Request();
    request.query('SELECT TOP 1 * FROM USERS', function(err, r) {
      if (err) return done(err);
      console.dir(r);
      sql.close();
    });
  });
  sql.on('error', function(err) {
    sql.close();
    done(err);
  });
});
