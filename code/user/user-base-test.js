import * as assert2 from "../base/assert2.js";
import * as init from "../base/init.js";
import * as config from "../base/config.js";
import * as db from '../db/db.js';
import * as userb from "../user/user-base.js";
import * as expl from "../express/express-local.js";
import * as expb from "../express/express-base.js";

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
