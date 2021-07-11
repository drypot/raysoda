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

import '../userx/userx-view.mjs';
import { parseArgv } from '../base/argv.mjs' // url 유저명 대조는 맨 마지막에

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

// this.#server.locals.appName = config.prop.appName
// this.#server.locals.appNamel = config.prop.appNamel
// this.#server.locals.appDesc = config.prop.appDesc

// 나중에 loadConfig 호출할 때 사용하자.
// config.argv = parseArgv(process.argv.slice(2))
// const epath = path || config.argv.config || config.argv.c
// if (typeof epath !== 'string') {
//   process.stdout.write('config file not found.\n')
//   process.stdout.write('\n')
//   process.stdout.write('node some.js --config config.json\n')
//   process.stdout.write('node some.js -c config.json\n')
//   process.exit(-1)
// }
//
//console.log('config: path=' + path)

// 이런 코드는 모두 main 으로 옮기자. init 에서 가져옴.
// process.on('uncaughtException', function (err) {
//   console.error(err.stack);
//   process.exit(1);
// });
