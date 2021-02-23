'use strict';

const init = require('../base/init');
const expb = require('../express/express-base');
const my2 = require('../mysql/my2');

require('../image/image-new');
require('../image/image-view');
require('../image/image-list');
require('../image/image-update');
require('../image/image-delete');
require('../image/image-years');

require('../user/user-new');
require('../user/user-view');

require('../user/user-update');
require('../user/user-deactivate');
require('../user/user-reset-pass');
require('../user/user-list');

require('../about/about-all');
require('../counter/counter-all');
require('../banner/banner-all');
require('../redirect/redirect-all');

require('../userx/userx-view'); // url 유저명 대조는 맨 마지막에

process.on('SIGINT', function() {
  my2.close(function(err) {
    console.log("SIGINT caught");
    process.exit(err ? 1 : 0);
  });
});

init.add((done) => {
  expb.start();
  done();
});

init.run();
