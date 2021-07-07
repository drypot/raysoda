import * as assert2 from "../base/assert2.mjs";
import * as init from "../base/init.mjs";
import * as config from "../base/config.mjs";
import * as db from '../db/db.mjs';
import * as userb from "../user/user-base.mjs";
import * as expl from "../express/express-local.mjs";
import * as expb from "../express/express-base.mjs";

before(function (done) {
  config.setPath('config/raysoda-test.json');
  db.setDropDatabase(true);
  init.run(done);
});

describe('table user', function () {
  it('should exist', function (done) {
    db.tableExists('user', (err, exist) => {
      assert2.ifError(err);
      assert2.ok(exist);
      done();
    });
  });
  it('getNewId should success', function () {
    assert2.e(userb.getNewId(), 1);
    assert2.ok(userb.getNewId() < userb.getNewId());
  });
});
