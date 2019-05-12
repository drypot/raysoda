'use strict';

const fs = require('fs');

const init = require('../base/init');
const error = require('../base/error');
const fs2 = require('../base/fs2');
const config = require('../base/config');
const mysql2 = require('../mysql/mysql2');
const expb = require('../express/express-base');
const expu = require('../express/express-upload');
const expl = require('../express/express-local');
const userf = require('../user/user-fixture');
const imageb = require('../image/image-base');
const imageu = require('../image/image-update');
const assert = require('assert');
const assert2 = require('../base/assert2');

before(function (done) {
  config.path = 'config/raysoda-test.json';
  mysql2.dropDatabase = true;
  init.run(done);
});

before((done) => {
  expb.start();
  done();
});

before(function (done) {
  imageb.emptyDir(done);
});

describe('put /api/images/id', function () {
  describe('updating with image', function () {
    before(function (done) {
      imageb.images.deleteMany(done);
    });
    before(function (done) {
      userf.login('user1', done);
    });
    it('should succeed', function (done) {
      expl.post('/api/images').field('comment', 'image1').attach('files', 'samples/2560x1440.jpg').end(function (err, res) {
        assert.ifError(err);
        assert2.empty(res.body.err);
        var _id = res.body.ids[0];
        imageb.images.findOne({ _id: _id }, function (err, image) {
          assert.ifError(err);
          assert2.ne(image, undefined);
          assert2.ne(image.cdate, undefined);
          assert2.e(image.comment, 'image1');
          imageb.identify(imageb.getPath(_id), function (err, meta) {
            assert.ifError(err);
            assert2.e(meta.width, imageb.maxWidth);
            assert(meta.height <imageb.maxWidth);
            expl.put('/api/images/' + _id).field('comment', 'image2').attach('files', 'samples/1440x2560.jpg').end(function (err, res) {
              assert.ifError(err);
              assert2.empty(res.body.err);
              imageb.images.findOne({ _id: _id }, function (err, image) {
                assert.ifError(err);
                assert2.ne(image, undefined);
                assert2.ne(image.cdate, undefined);
                assert2.e(image.comment, 'image2');
                imageb.identify(imageb.getPath(_id), function (err, meta) {
                  assert.ifError(err);
                  assert(meta.width < imageb.maxWidth);
                  assert2.e(meta.height, imageb.maxWidth);
                  done();
                });
              });
            });
          });
        });
      });
    });
  });
  describe('updating with small image', function () {
    before(function (done) {
      imageb.images.deleteMany(done);
    });
    before(function (done) {
      userf.login('user1', done);
    });
    it('should fail', function (done) {
      expl.post('/api/images').field('comment', 'image1').attach('files', 'samples/640x360.jpg').end(function (err, res) {
        assert.ifError(err);
        assert2.empty(res.body.err);
        var _id = res.body.ids[0];
        expl.put('/api/images/' + _id).attach('files', 'samples/360x240.jpg').end(function (err, res) {
          assert.ifError(err);
          assert2.ne(res.body.err, undefined);
          assert(error.find(res.body.err, 'IMAGE_SIZE'));
          done();
        });
      });
    });
  });
  describe('updating with no file', function () {
    before(function (done) {
      imageb.images.deleteMany(done);
    });
    before(function (done) {
      userf.login('user1', done);
    });
    it('should succeed', function (done) {
      expl.post('/api/images').field('comment', 'image1').attach('files', 'samples/640x360.jpg').end(function (err, res) {
        assert.ifError(err);
        assert2.empty(res.body.err);
        var _id = res.body.ids[0];
        expl.put('/api/images/' + _id).field('comment', 'updated with no file').end(function (err, res) {
          assert.ifError(err);
          assert2.empty(res.body.err);
          imageb.images.findOne({ _id: _id }, function (err, image) {
            assert.ifError(err);
            assert2.ne(image, undefined);
            assert2.e(image.comment, 'updated with no file');
            done();
          });
        });
      });
    });
  });
  describe('updating with text file', function () {
    before(function (done) {
      imageb.images.deleteMany(done);
    });
    before(function (done) {
      userf.login('user1', done);
    });
    it('should fail', function (done) {
      expl.post('/api/images').field('comment', 'image1').attach('files', 'samples/640x360.jpg').end(function (err, res) {
        assert.ifError(err);
        assert2.empty(res.body.err);
        var _id = res.body.ids[0];
        expl.put('/api/images/' + _id).attach('files', 'app/express/express-upload-f1.txt').end(function (err, res) {
          assert.ifError(err);
          assert2.ne(res.body.err, undefined);
          assert(error.find(res.body.err, 'IMAGE_TYPE'));
          done();
        });
      });
    });
  });
  describe('updating other\'s', function () {
    before(function (done) {
      imageb.images.deleteMany(done);
    });
    it('should fail', function (done) {
      userf.login('user1', function (err) {
        if (err) return done(err);
        expl.post('/api/images').field('comment', 'image1').attach('files', 'samples/640x360.jpg').end(function (err, res) {
          assert.ifError(err);
          assert2.empty(res.body.err);
          var _id = res.body.ids[0];
          userf.login('user2', function (err) {
            if (err) return done(err);
            expl.put('/api/images/' + _id).field('comment', 'xxx').end(function (err, res) {
              assert.ifError(err);
              assert2.ne(res.body.err, undefined);
              assert(error.find(res.body.err, 'NOT_AUTHORIZED'));
              done();
            });
          });
        });
      });
    });
  });
});
