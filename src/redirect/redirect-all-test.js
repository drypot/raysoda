import * as assert2 from "../base/assert2.js";
import * as init from "../base/init.js";
import * as config from "../base/config.js";
import * as expl from "../express/express-local.js";
import * as expb from "../express/express-base.js";
import * as redirecta from "../redirect/redirect-all.js";

before(function (done) {
  config.setPath('config/raysoda-test.json');
  init.run(done);
});

before((done) => {
  expb.start();
  done();
});

describe('redirecting /Com/Photo/View.aspx', function () {
  it('should succeed', function (done) {
    expl.get('/Com/Photo/View.aspx?f=A&pg=3&p=937928').redirects(0).end(function (err, res) {
      assert2.ok(err !== null);
      assert2.redirect(res, '/images/937928');
      done();
    });
  });
});

describe('redirecting /Com/Photo/List.aspx', function () {
  it('should succeed', function (done) {
    expl.get('/Com/Photo/List.aspx?f=A&s=DD&pg=3').redirects(0).end(function (err, res) {
      assert2.ok(err !== null);
      assert2.redirect(res, '/');
      done();
    });
  });
});

describe('redirecting /Com/Photo/CList.aspx', function () {
  it('should succeed', function (done) {
    expl.get('/Com/Photo/CList.aspx?f=C').redirects(0).end(function (err, res) {
      assert2.ok(err !== null);
      assert2.redirect(res, '/');
      done();
    });
  });
});

describe('redirecting /user', function () {
  it('should succeed', function (done) {
    expl.get('/user/1').redirects(0).end(function (err, res) {
      assert2.ok(err !== null);
      assert2.redirect(res, '/users/1');
      done();
    });
  });
});
