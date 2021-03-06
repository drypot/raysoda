import * as assert2 from "../base/assert2.js";
import * as init from "../base/init.js";
import * as error from "../base/error.js";
import * as config from "../base/config.js";
import * as db from '../db/db.js';
import * as expb from "../express/express-base.js";
import * as expl from "../express/express-local.js";
import * as persist from "../db/db-persist.js";
import * as userf from "../user/user-fixture.js";
import * as bannera from "../banner/banner-all.js";

before(function (done) {
  config.setPath('config/raysoda-test.json');
  db.setDropDatabase(true);
  init.run(done);
});

before((done) => {
  expb.start();
  done();
});

describe('banners', function () {
  const banners1 = [
    {text: "text1", url: "http://url1"},
    {text: "text2", url: "http://url2"},
    {text: "text3", url: "http://url3"},
  ];
  it('given admin login', function (done) {
   userf.login('admin', done);
  });
  it('putting should succeed', function (done) {
    expl.put('/api/banners').send({ banners: banners1 }).end(function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      done();
    });
  });
  it('putting can be checked', function (done) {
    persist.find('banners', function (err, value) {
      assert2.ifError(err);
      assert2.de(value, banners1);
      done();
    });
  });
  it('getting should succeed', function (done) {
    expl.get('/api/banners').end(function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      assert2.de(res.body.banners, banners1);
      done();
    })
  });
  it('given user login', function (done) {
   userf.login('user1', done);
  });
  it('putting should fail', function (done) {
    expl.put('/api/banners').send({ banners: banners1 }).end(function (err, res) {
      assert2.ifError(err);
      assert2.ok(error.find(res.body.err, 'NOT_AUTHORIZED'));
      done();
    });
  });
  it('getting should fail', function (done) {
    expl.get('/api/banners').end(function (err, res) {
      assert2.ifError(err);
      assert2.ok(error.find(res.body.err, 'NOT_AUTHORIZED'));
      done();
    })
  });
});

