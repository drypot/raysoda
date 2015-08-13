var fs = require('fs');

var init = require('../base/init');
var error = require('../base/error');
var fsp = require('../base/fs');
var config = require('../base/config')({ path: 'config/test.json' });
var mongop = require('../mongo/mongo')({ dropDatabase: true });
var exp = require('../express/express');
var upload = require('../express/upload');
var userf = require('../user/user-fixture');
var imageb = require('../image/image-base');
var imagen = require('../image/image-new');
var local = require('../express/local');
var expect = require('../base/assert').expect;

before(function (done) {
  init.run(done);
});

before(function (done) {
  userf.login('user1', done);
});

before(function (done) {
  imageb.emptyDir(done);
});

describe('posting horizonal image', function () {
  var _id;
  before(function (done) {
    imageb.images.deleteMany(done);
  });
  it('should success', function (done) {
    local.post('/api/images').field('comment', 'h image').attach('files', 'samples/3264x2448.jpg').end(function (err, res) {
      expect(err).not.exist;
      console.log(res.body.err);
      expect(res.body.err).not.exist;
      expect(res.body.ids).exist;
      expect(res.body.ids.length).equal(1);
      _id = res.body.ids[0];
      done();
    });
  });
  it('image should exist', function (done) {
    imageb.images.findOne({ _id: _id }, function (err, image) {
      expect(err).not.exist;
      expect(image._id).equal(_id);
      expect(image.uid).equal(userf.user1._id);
      expect(image.cdate).exist;
      expect(image.comment).equal('h image');
      var save = new imageb.FilePath(_id);
      imageb.identify(save.path, function (err, meta) {
        expect(err).not.exist;
        expect(meta.width).equal(1080);
        expect(meta.height).equal(810);
        done();
      });
    });
  });
});

describe('posting vertical image', function () {
  var _id;
  before(function (done) {
    imageb.images.deleteMany(done);
  });
  it('should success', function (done) {
    local.post('/api/images').field('comment', 'v image').attach('files', 'samples/2448x3264.jpg').end(function (err, res) {
      expect(err).not.exist;
      expect(res.body.err).not.exist;
      expect(res.body.ids).exist;
      expect(res.body.ids.length).equal(1);
      _id = res.body.ids[0];
      done();
    });
  });
  it('image should exist', function (done) {
    imageb.images.findOne({ _id: _id }, function (err, image) {
      expect(err).not.exist;
      expect(image._id).equal(_id);
      expect(image.uid).equal(userf.user1._id);
      expect(image.cdate).exist;
      expect(image.comment).equal('v image');
      var save = new imageb.FilePath(_id);
      imageb.identify(save.path, function (err, meta) {
        expect(err).not.exist;
        expect(meta.width).equal(810);
        expect(meta.height).equal(1080);
        done();
      });
    });
  });
});

describe('posting small images', function () {
  var _id;
  before(function (done) {
    imageb.images.deleteMany(done);
  });
  it('should success', function (done) {
    local.post('/api/images').field('comment', 'small image').attach('files', 'samples/960x540.jpg').end(function (err, res) {
      expect(err).not.exist;
      expect(res.body.err).not.exist;
      expect(res.body.ids).exist;
      expect(res.body.ids.length).equal(1);
      _id = res.body.ids[0];
      done();
    });
  });
  it('image should exist', function (done) {
    imageb.images.findOne({ _id: _id }, function (err, image) {
      expect(err).not.exist;
      expect(image._id).equal(_id);
      expect(image.uid).equal(userf.user1._id);
      expect(image.cdate).exist;
      expect(image.comment).equal('small image');
      var save = new imageb.FilePath(_id);
      imageb.identify(save.path, function (err, meta) {
        expect(err).not.exist;
        expect(meta.width).equal(960);
        expect(meta.height).equal(540);
        done();
      });
    });
  });
});

describe('posting too small', function () {
  var _files;
  before(function (done) {
    imageb.images.deleteMany(done);
  }); 
  it('should fail', function (done) {
    local.post('/api/images').attach('files', 'samples/360x240.jpg').end(function (err, res) {
      expect(err).not.exist;
      expect(res.body.err).exist;
      expect(res.body.err).error('IMAGE_SIZE');
      done();
    });
  });
});
