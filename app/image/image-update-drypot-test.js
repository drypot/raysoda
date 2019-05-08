'use strict';

var fs = require('fs');

var init = require('../base/init');
var error = require('../base/error');
var fs2 = require('../base/fs2');
var config = require('../base/config')({ path: 'config/drypot-test.json' });
var mongo2 = require('../mongo/mongo2')({ dropDatabase: true });
var expb = require('../express/express-base');
var expu = require('../express/express-upload');
var expl = require('../express/express-local');
var userf = require('../user/user-fixture');
var imageb = require('../image/image-base');
var imageu = require('../image/image-update');
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

describe('put /api/images/id', function () {
  describe('updating with image', function () {
    it('should succeed', function (done) {
      expl.post('/api/images').field('comment', 'image1').attach('files', 'samples/svg-sample.svg').end(function (err, res) {
        assert2.noError(err);
        assert2.empty(res.body.err);
        var _id = res.body.ids[0];
        imageb.identify(imageb.getPath(_id), function (err, meta) {
          assert2.noError(err);
          expl.put('/api/images/' + _id).field('comment', 'image2').attach('files', 'samples/svg-sample-2.svg').end(function (err, res) {
            assert2.noError(err);
            assert2.empty(res.body.err);
            imageb.images.findOne({ _id: _id }, function (err, image) {
              assert2.noError(err);
              assert2.ne(image, undefined);
              assert2.ne(image.cdate, undefined);
              assert2.e(image.comment, 'image2');
              imageb.identify(imageb.getPath(_id), function (err, meta) {
                assert2.noError(err);
                done();
              });
            });
          });
        });
      });
    });
  });
  describe('updating with jpg', function () {
    it('should fail', function (done) {
      expl.post('/api/images').field('comment', 'image1').attach('files', 'samples/svg-sample.svg').end(function (err, res) {
        assert2.noError(err);
        assert2.empty(res.body.err);
        var _id = res.body.ids[0];
        expl.put('/api/images/' + _id).attach('files', 'samples/640x360.jpg').end(function (err, res) {
          assert2.noError(err);
          assert2.ne(res.body.err, undefined);
          assert(error.find(res.body.err, 'IMAGE_TYPE'));
          done();
        });
      });
    });
  });
});
