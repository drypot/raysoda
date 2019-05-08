'use strict';

const init = require('../base/init');
const config = require('../base/config');
const mongo2 = require('../mongo/mongo2');
const expb = require('../express/express-base');
const imageb = require('../image/image-base');
const assert = require('assert');
const assert2 = require('../base/assert2');

before(function (done) {
  config.path = 'config/raysoda-test.json';
  mongo2.dropDatabase = true;
  init.run(done);
});

before((done) => {
  expb.start();
  done();
});

describe('imageb.images', function () {
  it('should exist', function () {
    assert2.ne(imageb.images, undefined);
  });
});

describe('getNewId()', function () {
  it('should work', function () {
    assert2.e(imageb.getNewId() < imageb.getNewId(), true);
  });
});

describe('identify()', function () {
  it('should work with jpeg', function (done) {
    imageb.identify('samples/1280x720.jpg', function (err, meta) {
      assert.ifError(err);
      assert2.e(meta.format, 'jpeg');
      assert2.e(meta.width, 1280);
      assert2.e(meta.height, 720);
      done();
    });
  });
  it('should work with svg', function (done) {
    imageb.identify('samples/svg-sample.svg', function (err, meta) {
      assert.ifError(err);
      assert2.e(meta.format, 'svg');
      assert2.e(meta.width, 1000);
      assert2.e(meta.height, 1000);
      done();
    });
  });
  it('should fail with invalid path', function (done) {
    imageb.identify('xxxx', function (err, meta) {
      assert(err !== null);
      done();
    })
  });
  it('should fail with non-image', function (done) {
    imageb.identify('README.md', function (err, meta) {
      assert(err !== null);
      done();
    })
  });
});
