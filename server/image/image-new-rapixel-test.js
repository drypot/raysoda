'use strict';

var fs = require('fs');

var init = require('../base/init');
var error = require('../base/error');
var fs2 = require('../base/fs2');
var config = require('../base/config')({ path: 'config/rapixel-test.json' });
var mongo2 = require('../base/mongo2')({ dropDatabase: true });
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
    expect(imageb.getDir(1)).equals(config.uploadDir + '/public/images/0/0/1');
    expect(imageb.getPath(1, 640)).equals(config.uploadDir + '/public/images/0/0/1/1-640.jpg');
    expect(imageb.getDirUrl(1)).equals(config.uploadSite + '/images/0/0/1');
    expect(imageb.getThumbUrl(1)).equals(config.uploadSite + '/images/0/0/1/1-2560.jpg');
  });
  it('should work for id 1 234 567', function () {
    expect(imageb.getDir(1234567)).equals(config.uploadDir + '/public/images/1/234/567');
    expect(imageb.getPath(1234567, 640)).equals(config.uploadDir + '/public/images/1/234/567/1234567-640.jpg');
    expect(imageb.getDirUrl(1234567)).equals(config.uploadSite + '/images/1/234/567');
    expect(imageb.getThumbUrl(1234567)).equals(config.uploadSite + '/images/1/234/567/1234567-2560.jpg');
  });
});

describe('post /api/images', function () {
  describe('posting one image', function () {
    before(function (done) {
      imageb.images.deleteMany(done);
    });
    it('should succeed', function (done) {
      expl.post('/api/images').field('comment', 'image1').attach('files', 'samples/5120x2880.jpg').end(function (err, res) {
        expect(err).not.exist;
        expect(res.body.err).not.exist;
        expect(res.body.ids).exist;
        expect(res.body.ids.length).equal(1);
        var _id = res.body.ids[0];
        imageb.images.findOne({ _id: _id }, function (err, image) {
          expect(err).not.exist;
          expect(image._id).equal(_id);
          expect(image.uid).equal(userf.user1._id);
          //expect(image.vers).eql([ 5120, 4096, 2560, 1920, 1280 ]);
          expect(image.vers).eql([ 5120, 4096, 2560]);
          expect(image.cdate).exist;
          expect(image.comment).equal('image1');
          expect(imageb.getPath(_id, 5120)).pathExist;
          expect(imageb.getPath(_id, 4096)).pathExist;
          expect(imageb.getPath(_id, 2560)).pathExist;
          expect(imageb.getPath(_id, 640)).not.pathExist;
          done();
        });
      });
    });
  });
  describe('posting small image', function () {
    before(function (done) {
      imageb.images.deleteMany(done);
    }); 
    it('should fail', function (done) {
      expl.post('/api/images').attach('files', 'samples/2560x1440.jpg').end(function (err, res) {
        expect(err).not.exist;
        expect(res.body.err).exist;
        expect(res.body.err).error('IMAGE_SIZE');
        done();
      });
    });
  });
});
