var init = require('../base/init');
var config = require('../base/config')({ path: 'config/test.json' });
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

describe('new FilePath()', function () {
  it('should work with id 1', function () {
    var path = new imageb.FilePath(1);
    expect(path.dir).equals(config.uploadDir + '/public/images/0/0');
    expect(path.path).equals(config.uploadDir + '/public/images/0/0/1.jpg');
  });
  it('should work with id 1 234 567', function () {
    var path = new imageb.FilePath(1234567);
    expect(path.dir).equals(config.uploadDir + '/public/images/1/234');
    expect(path.path).equals(config.uploadDir + '/public/images/1/234/1234567.jpg');
  });
});

describe('getUrlBase()', function () {
  it('should work with id 1', function () {
    expect(imageb.getUrlBase(1)).equals(config.uploadSite + '/images/0/0');
  });
  it('should work with id 1 234 567', function () {
    expect(imageb.getUrlBase(1234567)).equals(config.uploadSite + '/images/1/234');
  });
});

describe('identify()', function () {
  it('should work with jpeg', function (done) {
    imageb.identify('samples/960x540.jpg', function (err, meta) {
      expect(err).not.exist;
      expect(meta.format).equal('jpeg');
      expect(meta.width).equal(960);
      expect(meta.height).equal(540);
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
