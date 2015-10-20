var init = require('../base/init');
var util2 = require('../base/util2');
var config = require('../base/config');

init.add(function (done) {
  util2.mergeObject(module.exports, require('./image-site-' + config.appNamel));
  done();
});
