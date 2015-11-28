var init = require('../base/init');
var config = require('../base/config')({ path: 'config/raysoda-test.json' });
var imageb = require('../image/image-base');
var expect = require('../base/assert2').expect;

before(function (done) {
  init.run(done);
});

describe('imageb.images', function () {
  it('should exist', function () {
    expect(imageb.images).exist;
  });
});

describe('getNewId()', function () {
  it('should work', function () {
    expect(imageb.getNewId() < imageb.getNewId()).true;
  });
});

describe('identify()', function () {
  it('should work with jpeg', function (done) {
    imageb.identify('samples/1280x720.jpg', function (err, meta) {
      expect(err).not.exist;
      expect(meta.format).equal('jpeg');
      expect(meta.width).equal(1280);
      expect(meta.height).equal(720);
      done();
    });
  });
  it('should work with svg', function (done) {
    imageb.identify('samples/svg-sample.svg', function (err, meta) {
      expect(err).not.exist;
      expect(meta.format).equal('svg');
      expect(meta.width).equal(1000);
      expect(meta.height).equal(1000);
      done();
    });
  });
  it('should fail with invalid path', function (done) {
    imageb.identify('xxxx', function (err, meta) {
      expect(err).exist;
      done();
    })
  });
  it('should fail with non-image', function (done) {
    imageb.identify('README.md', function (err, meta) {
      expect(err).exist;
      done();
    })
  });
});
