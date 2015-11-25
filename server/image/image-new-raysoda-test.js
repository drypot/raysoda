var fs = require('fs');

var init = require('../base/init');
var error = require('../base/error');
var fs2 = require('../base/fs2');
var config = require('../base/config')({ path: 'config/test.json' });
var mongob = require('../base/mongo-base')({ dropDatabase: true });
var expb = require('../express/express-base');
var expu = require('../express/express-upload');
var expl = require('../express/express-local');
var userf = require('../user/user-fixture');
var imageb = require('../image/image-base');
var imagen = require('../image/image-new');
var expect = require('../base/assert2').expect;

before(function (done) {
  init.run(done);
});

before(function (done) {
  userf.login('user1', done);
});

before(function (done) {
  imageb.emptyDir(done);
});

var _id;

describe('post /api/images', function () {
  describe('posting horizonal image', function () {
    before(function (done) {
      imageb.images.deleteMany(done);
    });
    it('should succeed', function (done) {
      expl.post('/api/images').field('comment', 'h image').attach('files', 'samples/3264x2448.jpg').end(function (err, res) {
        expect(err).not.exist;
        expect(res.body.err).not.exist;
        expect(res.body.ids).exist;
        expect(res.body.ids.length).equal(1);
        _id = res.body.ids[0];
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
  });
  describe('posting vertical image', function () {
    before(function (done) {
      imageb.images.deleteMany(done);
    });
    it('should succeed', function (done) {
      expl.post('/api/images').field('comment', 'v image').attach('files', 'samples/2448x3264.jpg').end(function (err, res) {
        expect(err).not.exist;
        expect(res.body.err).not.exist;
        expect(res.body.ids).exist;
        expect(res.body.ids.length).equal(1);
        _id = res.body.ids[0];
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
  });
  describe('posting small images', function () {
    before(function (done) {
      imageb.images.deleteMany(done);
    });
    it('should succeed', function (done) {
      expl.post('/api/images').field('comment', 'small image').attach('files', 'samples/960x540.jpg').end(function (err, res) {
        expect(err).not.exist;
        expect(res.body.err).not.exist;
        expect(res.body.ids).exist;
        expect(res.body.ids.length).equal(1);
        _id = res.body.ids[0];
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
  });
  describe('posting too small', function () {
    before(function (done) {
      imageb.images.deleteMany(done);
    }); 
    it('should fail', function (done) {
      expl.post('/api/images').attach('files', 'samples/360x240.jpg').end(function (err, res) {
        expect(err).not.exist;
        expect(res.body.err).exist;
        expect(res.body.err).error('IMAGE_SIZE');
        done();
      });
    });
  });
});
