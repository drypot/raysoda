import * as assert2 from "../base/assert2.js";
import * as init from "../base/init.js";
import * as config from "../base/config.js";
import * as db from '../db/db.js';
import * as bannerb from "../banner/banner-base.js";

before(function (done) {
  config.setPath('config/raysoda-test.json');
  db.setDropDatabase(true);
  init.run(done);
});

describe('banners', function () {
  it('should exist', function () {
    assert2.de(bannerb.banners, []);
  });
});
