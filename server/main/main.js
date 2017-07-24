'use strict';

var init = require('../base/init');
var config = require('../base/config');
var expb = require('../express/express-base');

require('../image/image-new');
require('../image/image-view');
require('../image/image-list');
require('../image/image-update');
require('../image/image-delete');

require('../user/user-new');
require('../user/user-view');

require('../user/user-update');
require('../user/user-deactivate');
require('../user/user-reset-pass');

require('../about/about-all');
require('../counter/counter-all');
require('../banner/banner-all');
require('../redirect/redirect-all');

require('../userx/userx-list');
require('../userx/userx-view'); // url 유저명 대조는 맨 마지막에

init.run(function (err) {
  if (err) throw err;
});
