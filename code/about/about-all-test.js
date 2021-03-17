import * as assert2 from "../base/assert2.js";
import * as init from "../base/init.js";
import * as error from "../base/error.js";
import * as config from "../base/config.js";
import * as expb from "../express/express-base.js";
import * as expl from "../express/express-local.js";
import * as bannera from "../about/about-all.js";

before(function (done) {
  config.setPath('config/raysoda-test.json');
  init.run(done);
});

before((done) => {
  expb.start();
  done();
});

describe('about-all', function () {
});
