import * as assert2 from "../base/assert2.mjs";
import * as init from "../base/init.mjs";
import * as config from "../base/config.mjs";
import * as db from '../db/db.mjs';
import * as bannerb from "../banner/banner-base.mjs";

beforeAll(done => {
  config.setPath('config/raysoda-test.json');
  db.setDropDatabase(true);
  init.run(done);
});

describe('banners', () => {
  it('should exist', () => {
    assert2.de(bannerb.banners, []);
  });
});
