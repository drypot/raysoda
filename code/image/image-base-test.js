import * as assert2 from "../base/assert2.js";

import * as init from "../base/init.js";
import * as config from "../base/config.js";
import * as db from '../db/db.js';
import * as expb from "../express/express-base.js";
import * as imageb from "../image/image-base.js";

before(function (done) {
  config.setPath('config/raysoda-test.json');
  db.setDropDatabase(true);
  init.run(done);
});

before((done) => {
  expb.start();
  done();
});

describe('table image', function () {
  it('should exist', function (done) {
    db.tableExists('image', (err, exist) => {
      assert2.ifError(err);
      assert2.ok(exist);
      done();
    });
  });
  it('getNewId should success', function () {
    assert2.e(imageb.getNewId(), 1);
    assert2.ok(imageb.getNewId() < imageb.getNewId());
  });
});

describe('identify()', function () {
  it('should work with jpeg', function (done) {
    imageb.identify('samples/1280x720.jpg', function (err, meta) {
      assert2.ifError(err);
      assert2.e(meta.format, 'jpeg');
      assert2.e(meta.width, 1280);
      assert2.e(meta.height, 720);
      done();
    });
  });
  it('should work with svg', function (done) {
    imageb.identify('samples/svg-sample.svg', function (err, meta) {
      assert2.ifError(err);
      assert2.e(meta.format, 'svg');
      assert2.e(meta.width, 1000);
      assert2.e(meta.height, 1000);
      done();
    });
  });
  it('should fail with invalid path', function (done) {
    imageb.identify('xxxx', function (err, meta) {
      assert2.ok(err !== null);
      done();
    })
  });
  it('should fail with non-image', function (done) {
    imageb.identify('README.md', function (err, meta) {
      assert2.ok(err !== null);
      done();
    })
  });
});
