'use strict';

var fs = require('fs');

var init = require('../base/init');
var error = require('../base/error');
var fs2 = require('../base/fs2');
var config = require('../base/config')({ path: 'config/rapixel-test.json' });
var mongo2 = require('../mongo/mongo2')({ dropDatabase: true });
var expb = require('../express/express-base');
var expu = require('../express/express-upload');
var expl = require('../express/express-local');
var userf = require('../user/user-fixture');
var imageb = require('../image/image-base');
var imagen = require('../image/image-new');
var assert = require('assert');
var assert2 = require('../base/assert2');

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
    assert2.e(imageb.getDir(1), config.uploadDir + '/public/images/0/0/1');
    assert2.e(imageb.getPath(1, 640), config.uploadDir + '/public/images/0/0/1/1-640.jpg');
    assert2.e(imageb.getDirUrl(1), config.uploadSite + '/images/0/0/1');
    assert2.e(imageb.getThumbUrl(1), config.uploadSite + '/images/0/0/1/1-2560.jpg');
  });
  it('should work for id 1 234 567', function () {
    assert2.e(imageb.getDir(1234567), config.uploadDir + '/public/images/1/234/567');
    assert2.e(imageb.getPath(1234567, 640), config.uploadDir + '/public/images/1/234/567/1234567-640.jpg');
    assert2.e(imageb.getDirUrl(1234567), config.uploadSite + '/images/1/234/567');
    assert2.e(imageb.getThumbUrl(1234567), config.uploadSite + '/images/1/234/567/1234567-2560.jpg');
  });
});

describe('post /api/images', function () {
  describe('posting one image', function () {
    before(function (done) {
      imageb.images.deleteMany(done);
    });
    it('should succeed', function (done) {
      expl.post('/api/images').field('comment', 'image1').attach('files', 'samples/5120x2880.jpg').end(function (err, res) {
        assert.ifError(err);
        assert.ifError(res.body.err);
        assert2.ne(res.body.ids, undefined);
        assert2.e(res.body.ids.length, 1);
        var _id = res.body.ids[0];
        imageb.images.findOne({ _id: _id }, function (err, image) {
          assert.ifError(err);
          assert2.e(image._id, _id);
          assert2.e(image.uid, userf.user1._id);
          //assert2.de(image.vers, [ 5120, 4096, 2560, 1920, 1280 ]);
          assert2.de(image.vers, [ 5120, 4096, 2560, 1280]);
          assert2.ne(image.cdate, undefined);
          assert2.e(image.comment, 'image1');
          assert2.path(imageb.getPath(_id, 5120));
          assert2.path(imageb.getPath(_id, 4096));
          assert2.path(imageb.getPath(_id, 2560));
          assert2.path(imageb.getPath(_id, 1280));
          assert2.path(imageb.getPath(_id, 640), false);
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
        assert.ifError(err);
        assert2.ne(res.body.err, undefined);
        assert(error.find(res.body.err, 'IMAGE_SIZE'));
        done();
      });
    });
  });
});
