'use strict';

var init = require('../base/init');
var config = require('../base/config')({ path: 'config/raysoda-test.json' });
var imageb = require('../image/image-base');
var assert = require('assert');
var assert2 = require('../base/assert2');

before(function (done) {
  init.run(done);
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
      assert2.noError(err);
      assert2.e(meta.format, 'jpeg');
      assert2.e(meta.width, 1280);
      assert2.e(meta.height, 720);
      done();
    });
  });
  it('should work with svg', function (done) {
    imageb.identify('samples/svg-sample.svg', function (err, meta) {
      assert2.noError(err);
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
