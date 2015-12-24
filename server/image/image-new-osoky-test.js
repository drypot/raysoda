'use strict';

var fs = require('fs');

var init = require('../base/init');
var error = require('../base/error');
var fs2 = require('../base/fs2');
var config = require('../base/config')({ path: 'config/osoky-test.json' });
var mongo2 = require('../mongo/mongo2')({ dropDatabase: true });
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

describe('getDir()', function () {
  it('should work for id 1', function () {
    expect(imageb.getDir(1)).equals(config.uploadDir + '/public/images/0/0');
    expect(imageb.getPath(1)).equals(config.uploadDir + '/public/images/0/0/1.jpg');
    expect(imageb.getDirUrl(1)).equals(config.uploadSite + '/images/0/0');
    expect(imageb.getThumbUrl(1)).equals(config.uploadSite + '/images/0/0/1.jpg');
  });
  it('should work for id 1 234 567', function () {
    expect(imageb.getDir(1234567)).equals(config.uploadDir + '/public/images/1/234');
    expect(imageb.getPath(1234567)).equals(config.uploadDir + '/public/images/1/234/1234567.jpg');
    expect(imageb.getDirUrl(1234567)).equals(config.uploadSite + '/images/1/234');
    expect(imageb.getThumbUrl(1234567)).equals(config.uploadSite + '/images/1/234/1234567.jpg');
  });
});

describe('post /api/images', function () {
  describe('posting big', function () {
    before(function (done) {
      imageb.images.deleteMany(done);
    });
    it('should succeed', function (done) {
      expl.post('/api/images').field('comment', 'image1').attach('files', 'samples/4096x2304.jpg').end(function (err, res) {
        expect(err).not.exist;
        expect(res.body.err).not.exist;
        expect(res.body.ids).exist;
        expect(res.body.ids.length).equal(1);
        var _id = res.body.ids[0];
        imageb.images.findOne({ _id: _id }, function (err, image) {
          expect(err).not.exist;
          expect(image._id).equal(_id);
          expect(image.uid).equal(userf.user1._id);
          expect(image.cdate).exist;
          expect(image.comment).equal('image1');
          imageb.identify(imageb.getPath(_id), function (err, meta) {
            expect(err).not.exist;
            expect(meta.width).equal(imageb.maxWidth);
            expect(meta.height).equal(imageb.maxWidth);
            done();
          });
        });
      });
    });
  });
  describe('posting small', function () {
    before(function (done) {
      imageb.images.deleteMany(done);
    });
    it('should succeed', function (done) {
      expl.post('/api/images').field('comment', 'image1').attach('files', 'samples/1280x720.jpg').end(function (err, res) {
        expect(err).not.exist;
        expect(res.body.err).not.exist;
        expect(res.body.ids).exist;
        expect(res.body.ids.length).equal(1);
        var _id = res.body.ids[0];
        imageb.images.findOne({ _id: _id }, function (err, image) {
          expect(err).not.exist;
          expect(image._id).equal(_id);
          expect(image.uid).equal(userf.user1._id);
          expect(image.cdate).exist;
          expect(image.comment).equal('image1');
          imageb.identify(imageb.getPath(_id), function (err, meta) {
            expect(err).not.exist;
            expect(meta.width).equal(720);
            expect(meta.height).equal(720);
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
      expl.post('/api/images').attach('files', 'samples/640x360.jpg').end(function (err, res) {
        expect(err).not.exist;
        expect(res.body.err).exist;
        expect(res.body.err).error('IMAGE_SIZE');
        done();
      });
    });
  });
});
