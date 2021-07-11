import * as init from "../base/init.mjs";
import * as config from "../base/config.mjs";
import * as db from '../db/db.mjs';
import * as userb from "../user/user-base.mjs";
import * as expl from "../express/express-local.mjs";
import * as expb from "../express/express-base.mjs";

beforeAll(done => {
  config.setPath('config/raysoda-test.json');
  db.setDropDatabase(true);
  init.run(done);
});

describe('table user', () => {
  it('should exist', done => {
    db.tableExists('user', (err, exist) => {
      expect(err).toBeFalsy();
      assert2.ok(exist);
      done();
    });
  });
  it('getNewId should success', () => {
    expect(userb.getNewId()).toBe(1);
    assert2.ok(userb.getNewId() < userb.getNewId());
  });
});
