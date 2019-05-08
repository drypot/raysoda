'use strict';

const fs = require('fs');

const init = require('../base/init');
const error = require('../base/error');
const fs2 = require('../base/fs2');
const config = require('../base/config');
const mongo2 = require('../mongo/mongo2');
const expb = require('../express/express-base');
const expu = require('../express/express-upload');
const expl = require('../express/express-local');
const userf = require('../user/user-fixture');
const imageb = require('../image/image-base');
const imagen = require('../image/image-new');
const assert = require('assert');
const assert2 = require('../base/assert2');

before(function (done) {
  config.path = 'config/drypot-test.json';
  mongo2.dropDatabase = true;
  init.run(done);
});

before((done) => {
  expb.start();
  done();
});

before(function (done) {
  userf.login('user1', done);
});

before(function (done) {
  imageb.emptyDir(done);
});

describe('getDir()', function () {
  it('should work for id 1', function () {
    assert2.e(imageb.getDir(1), config.uploadDir + '/public/images/0/0');
    assert2.e(imageb.getPath(1), config.uploadDir + '/public/images/0/0/1.svg');
    assert2.e(imageb.getDirUrl(1), config.uploadSite + '/images/0/0');
    assert2.e(imageb.getThumbUrl(1), config.uploadSite + '/images/0/0/1.svg');
  });
  it('should work for id 1 234 567', function () {
    assert2.e(imageb.getDir(1234567), config.uploadDir + '/public/images/1/234');
    assert2.e(imageb.getPath(1234567), config.uploadDir + '/public/images/1/234/1234567.svg');
    assert2.e(imageb.getDirUrl(1234567), config.uploadSite + '/images/1/234');
    assert2.e(imageb.getThumbUrl(1234567), config.uploadSite + '/images/1/234/1234567.svg');
  });
});

describe('post /api/images', function () {
  describe('posting one image', function () {
    before(function (done) {
      imageb.images.deleteMany(done);
    });
    it('should succeed', function (done) {
      expl.post('/api/images').field('comment', 'image1').attach('files', 'samples/svg-sample.svg').end(function (err, res) {
        assert.ifError(err);
        assert2.empty(res.body.err);
        assert2.ne(res.body.ids, undefined);
        assert2.e(res.body.ids.length, 1);
        var _id = res.body.ids[0];
        imageb.images.findOne({ _id: _id }, function (err, image) {
          assert.ifError(err);
          assert2.e(image._id, _id);
          assert2.e(image.uid, userf.user1._id);
          assert2.e(image.width, undefined);
          assert2.e(image.vers, undefined);
          assert2.ne(image.cdate, undefined);
          assert2.e(image.comment, 'image1');
          assert2.path(imageb.getPath(_id));
          done();
        });
      });
    });
  });
  describe('posting jpeg', function () {
    before(function (done) {
      imageb.images.deleteMany(done);
    });
    it('should fail', function (done) {
      expl.post('/api/images').attach('files', 'samples/640x360.jpg').end(function (err, res) {
        assert.ifError(err);
        assert2.ne(res.body.err, undefined);
        assert(error.find(res.body.err, 'IMAGE_TYPE'));
        done();
      });
    });
  });
});
