import * as init from "../base/init.mjs";
import * as db from '../db/db.mjs';
import * as expb from "../express/express-base.mjs";

import '../image/image-new.mjs';
import '../image/image-view.mjs';
import '../image/image-list.mjs';
import '../image/image-update.mjs';
import '../image/image-delete.mjs';
import '../image/image-years.mjs';

import '../user/user-new.mjs';
import '../user/user-view.mjs';
import '../user/user-update.mjs';
import '../user/user-deactivate.mjs';
import '../user/user-reset-pass.mjs';
import '../user/user-list.mjs';

import '../about/about-all.mjs';
import '../counter/counter-all.mjs';
import '../banner/banner-all.mjs';

import '../redirect/redirect-all.mjs';

import '../userx/userx-view.mjs'; // url 유저명 대조는 맨 마지막에

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
