import * as init from "../base/init.mjs";
import * as config from "../base/config.mjs";
import * as db from '../db/db.mjs';
import * as expb from '../express/express-base.mjs';
import * as expl from '../express/express-local.mjs';
import * as userb from '../user/user-base.mjs';
import * as userf from '../user/user-fixture.mjs';
import * as userxv from "../userx/userx-view.mjs";

beforeAll(done => {
  config.setPath('config/raysoda-test.json');
  db.setDropDatabase(true);
  init.run(done);
});

beforeAll((done) => {
  expb.start();
  done();
});

describe('get /users/:id([0-9]+)', () => {
  it('should succeed', done => {
    expl.get('/users/1').end(function (err, res) {
      expect(err).toBeFalsy();
      assert2.ifError(res.body.err);
      done();
    });
  });
});

describe('get /:name([^/]+)', () => {
  it('should succeed for /user1', done => {
    expl.get('/user1').end(function (err, res) {
      expect(err).toBeFalsy();
      assert2.ifError(res.body.err);
      done();
    });
  });
  it('should succeed for /USER1', done => {
    expl.get('/USER1').end(function (err, res) {
      expect(err).toBeFalsy();
      assert2.ifError(res.body.err);
      done();
    });
  });
  it('should fail with invalid name', done => {
    expl.get('/xman').end(function (err, res) {
      assert2.ok(err !== null);
      done();
    });
  });
});
