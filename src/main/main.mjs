import * as init from "../base/init.js";
import * as db from '../db/db.js';
import * as expb from "../express/express-base.js";

import '../image/image-new.js';
import '../image/image-view.js';
import '../image/image-list.js';
import '../image/image-update.js';
import '../image/image-delete.js';
import '../image/image-years.js';

import '../user/user-new.js';
import '../user/user-view.js';
import '../user/user-update.js';
import '../user/user-deactivate.js';
import '../user/user-reset-pass.js';
import '../user/user-list.js';

import '../about/about-all.js';
import '../counter/counter-all.js';
import '../banner/banner-all.js';

import '../redirect/redirect-all.js';

import '../userx/userx-view.js'; // url 유저명 대조는 맨 마지막에

// 2021-03-16
// pm2 에서 *.js 파일은 es 모듈로 인식하지 못한다.
// 이 문제를 해결하기 위해 main.js를 main.mjs로 변경.
//

process.on('SIGINT', function() {
  db.close(function(err) {
    console.log("SIGINT caught");
    process.exit(err ? 1 : 0);
  });
});

init.add((done) => {
  expb.start();
  done();
});

init.run();
