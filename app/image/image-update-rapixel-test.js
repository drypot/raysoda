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
      expl.post('/api/images').field('comment', 'image1').attach('files', 'samples/5120x2880.jpg').end(function (err, res) {
        assert2.noError(err);
        assert2.empty(res.body.err);
        var _id = res.body.ids[0];
        imageb.images.findOne({ _id: _id }, function (err, image) {
          assert2.noError(err);
          assert2.ne(image, undefined);
          //assert2.de(image.vers, [ 5120, 4096, 2560, 1920, 1280 ]);
          assert2.de(image.vers, [ 5120, 4096, 2560, 1280]);
          assert2.e(image.comment, 'image1');
          assert2.path(imageb.getPath(_id, 5120));
          assert2.path(imageb.getPath(_id, 4096));
          assert2.path(imageb.getPath(_id, 2560));
          assert2.path(imageb.getPath(_id, 1280));
          fs2.emptyDir(imageb.getDir(_id), function (err) {
            if (err) return done(err);
            expl.put('/api/images/' + _id).field('comment', 'image2').attach('files', 'samples/4096x2304.jpg').end(function (err, res) {
              assert2.noError(err);
              assert2.empty(res.body.err);
              imageb.images.findOne({ _id: _id }, function (err, image) {
                assert2.noError(err);
                assert2.ne(image, undefined);
                //assert2.de(image.vers, [ 4096, 2560, 1920, 1280 ]);
                assert2.de(image.vers, [ 4096, 2560, 1280 ]);
                assert2.e(image.comment, 'image2');
                assert2.path(imageb.getPath(_id, 5120), false);
                assert2.path(imageb.getPath(_id, 4096));
                assert2.path(imageb.getPath(_id, 2560));
                assert2.path(imageb.getPath(_id, 1280));
                done();
              });
            });
          });
        });
      });
    });
  });
  describe('updating with small image', function () {
    it('should fail', function (done) {
      expl.post('/api/images').field('comment', 'image1').attach('files', 'samples/5120x2880.jpg').end(function (err, res) {
        assert2.noError(err);
        assert2.empty(res.body.err);
        var _id = res.body.ids[0];
        expl.put('/api/images/' + _id).attach('files', 'samples/2560x1440.jpg').end(function (err, res) {
          assert2.noError(err);
          assert2.ne(res.body.err, undefined);
          assert(error.find(res.body.err, 'IMAGE_SIZE'));
          done();
        });
      });
    });
  });
});
