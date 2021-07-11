import * as init from "../base/init.mjs";
import * as error from "../base/error.mjs";
import * as config from "../base/config.mjs";
import * as db from '../db/db.mjs';
import * as expb from "../express/express-base.mjs";
import * as expl from "../express/express-local.mjs";
import * as persist from "../db/db-persist.mjs";
import * as userf from "../user/user-fixture.mjs";
import * as bannera from "../banner/banner-all.mjs";

beforeAll(done => {
  config.setPath('config/raysoda-test.json');
  db.setDropDatabase(true);
  init.run(done);
});

beforeAll((done) => {
  expb.start();
  done();
});

describe('banners', () => {
  const banners1 = [
    {text: "text1", url: "http://url1"},
    {text: "text2", url: "http://url2"},
    {text: "text3", url: "http://url3"},
  ];
  it('given admin login', done => {
   userf.login('admin', done);
  });
  it('putting should succeed', done => {
    expl.put('/api/banners').send({ banners: banners1 }).end(function (err, res) {
      expect(err).toBeFalsy();
      assert2.ifError(res.body.err);
      done();
    });
  });
  it('putting can be checked', done => {
    persist.find('banners', function (err, value) {
      expect(err).toBeFalsy();
      assert2.de(value, banners1);
      done();
    });
  });
  it('getting should succeed', done => {
    expl.get('/api/banners').end(function (err, res) {
      expect(err).toBeFalsy();
      assert2.ifError(res.body.err);
      assert2.de(res.body.banners, banners1);
      done();
    })
  });
  it('given user login', done => {
   userf.login('user1', done);
  });
  it('putting should fail', done => {
    expl.put('/api/banners').send({ banners: banners1 }).end(function (err, res) {
      expect(err).toBeFalsy();
      assert2.ok(error.errorExists(res.body.err, 'NOT_AUTHORIZED'));
      done();
    });
  });
  it('getting should fail', done => {
    expl.get('/api/banners').end(function (err, res) {
      expect(err).toBeFalsy();
      assert2.ok(error.errorExists(res.body.err, 'NOT_AUTHORIZED'));
      done();
    })
  });
});

