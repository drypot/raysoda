var init = require('../base/init');
var config = require('../base/config')({ path: 'config/test.json' });
var imageb = require('../image/image-base');
var expect = require('../base/assert2').expect;

before(function (done) {
  init.run(done);
});

describe('images', function () {
  it('should exist', function () {
    expect(imageb.images).exist;
  });
  it('getNewId should success', function () {
    expect(imageb.getNewId() < imageb.getNewId()).true;
  });
});

describe('FilePath', function () {
  it('should success', function () {
    var path = new imageb.FilePath(1);
    expect(path.dir).equals(config.uploadDir + '/public/images/0/0/1');
    expect(path.path).equals(config.uploadDir + '/public/images/0/0/1/1.jpg');
  });
});

describe('getUrlBase', function () {
  it('should success', function () {
    expect(imageb.getUrlBase(1)).equals(config.uploadSite + '/images/0/0/1');
  });
});

describe('identify', function () {
  it('invalid path should fail', function (done) {
    imageb.identify('xxxx', function (err, meta) {
      expect(err).exist;
      done();
    })
  });
  it('non image should fail', function (done) {
    imageb.identify('README.md', function (err, meta) {
      expect(err).exist;
      done();
    })
  });
  it('jpeg should success', function (done) {
    imageb.identify('samples/3264x2448.jpg', function (err, meta) {
      expect(err).not.exist;
      expect(meta.format).equal('jpeg');
      expect(meta.width).equal(3264);
      expect(meta.height).equal(2448);
      done();
    });
  });
});
