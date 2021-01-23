'use strict';

const assert = require('assert');
const assert2 = require('../base/assert2');
const init = require('../base/init');
const error = require('../base/error');
const fs2 = require('../base/fs2');
const config = require('../base/config');
const my2 = require('../mysql/my2');
const expb = require('../express/express-base');
const expu = require('../express/express-upload');
const expl = require('../express/express-local');
const userf = require('../user/user-fixture');
const imageb = require('../image/image-base');
const imageu = require('../image/image-update');

before(function (done) {
  config.path = 'config/rapixel-test.json';
  my2.dropDatabase = true;
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

describe('put /api/images/id', function () {
  describe('updating with image', function () {
    it('should succeed', function (done) {
      expl.post('/api/images').field('comment', 'image1').attach('files', 'samples/5120x2880.jpg').end(function (err, res) {
        assert.ifError(err);
        assert.ifError(res.body.err);
        var _id = res.body.ids[0];
        my2.queryOne('select * from image where id = ?', _id, (err, image) => {
          assert.ifError(err);
          assert.notStrictEqual(image, undefined);
          imageb.unpackImage(image);
          //assert.deepStrictEqual(image.vers, [ 5120, 4096, 2560, 1920, 1280 ]);
          assert.deepStrictEqual(image.vers, [ 5120, 4096, 2560, 1280]);
          assert.strictEqual(image.comment, 'image1');
          assert2.path(imageb.getPath(_id, 5120));
          assert2.path(imageb.getPath(_id, 4096));
          assert2.path(imageb.getPath(_id, 2560));
          assert2.path(imageb.getPath(_id, 1280));
          fs2.emptyDir(imageb.getDir(_id), function (err) {
            if (err) return done(err);
            expl.put('/api/images/' + _id).field('comment', 'image2').attach('files', 'samples/4096x2304.jpg').end(function (err, res) {
              assert.ifError(err);
              assert.ifError(res.body.err);
              my2.queryOne('select * from image where id = ?', _id, (err, image) => {
                assert.ifError(err);
                assert.notStrictEqual(image, undefined);
                imageb.unpackImage(image);
                //assert.deepStrictEqual(image.vers, [ 4096, 2560, 1920, 1280 ]);
                assert.deepStrictEqual(image.vers, [ 4096, 2560, 1280 ]);
                assert.strictEqual(image.comment, 'image2');
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
        assert.ifError(err);
        assert.ifError(res.body.err);
        var _id = res.body.ids[0];
        expl.put('/api/images/' + _id).attach('files', 'samples/2560x1440.jpg').end(function (err, res) {
          assert.ifError(err);
          assert(res.body.err);
          assert(error.find(res.body.err, 'IMAGE_SIZE'));
          done();
        });
      });
    });
  });
});
