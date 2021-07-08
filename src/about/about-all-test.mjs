import * as assert2 from "../base/assert2.mjs";
import * as init from "../base/init.mjs";
import * as error from "../base/error.mjs";
import * as config from "../base/config.mjs";
import * as expb from "../express/express-base.mjs";
import * as expl from "../express/express-local.mjs";
import * as bannera from "../about/about-all.mjs";

beforeAll(done => {
  config.setPath('config/raysoda-test.json');
  init.run(done);
});

beforeAll((done) => {
  expb.start();
  done();
});

describe('about all pages', () => {
  describe('get /about/site', () => {
    it('should succeed', done => {
      expl.get('/about/site').end(function (err, res) {
        assert2.ifError(err);
        done();
      });
    });
  });
  describe('get /about/company', () => {
    it('should succeed', done => {
      expl.get('/about/company').end(function (err, res) {
        assert2.ifError(err);
        done();
      });
    });
  });
  describe('get /about/ad', () => {
    it('should succeed', done => {
      expl.get('/about/ad').end(function (err, res) {
        assert2.ifError(err);
        done();
      });
    });
  });
  describe('get /about/privacy', () => {
    it('should succeed', done => {
      expl.get('/about/privacy').end(function (err, res) {
        assert2.ifError(err);
        done();
      });
    });
  });
  describe('get /about/help', () => {
    it('should succeed', done => {
      expl.get('/about/help').end(function (err, res) {
        assert2.ifError(err);
        done();
      });
    });
  });

});
