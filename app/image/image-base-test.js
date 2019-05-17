'use strict';

const assert = require('assert');
const init = require('../base/init');
const config = require('../base/config');
const my2 = require('../mysql/my2');
const expb = require('../express/express-base');
const imageb = require('../image/image-base');

before(function (done) {
  config.path = 'config/raysoda-test.json';
  my2.dropDatabase = true;
  init.run(done);
});

before((done) => {
  expb.start();
  done();
});

describe('table image', function () {
  it('should exist', function (done) {
    my2.tableExists('image', (err, exist) => {
      assert.ifError(err);
      assert(exist);
      done();
    });
  });
  it('getNewId should success', function () {
    assert(imageb.getNewId() === 1);
    assert(imageb.getNewId() < imageb.getNewId());
  });
});

describe('identify()', function () {
  it('should work with jpeg', function (done) {
    imageb.identify('samples/1280x720.jpg', function (err, meta) {
      assert.ifError(err);
      assert.strictEqual(meta.format, 'jpeg');
      assert.strictEqual(meta.width, 1280);
      assert.strictEqual(meta.height, 720);
      done();
    });
  });
  it('should work with svg', function (done) {
    imageb.identify('samples/svg-sample.svg', function (err, meta) {
      assert.ifError(err);
      assert.strictEqual(meta.format, 'svg');
      assert.strictEqual(meta.width, 1000);
      assert.strictEqual(meta.height, 1000);
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
