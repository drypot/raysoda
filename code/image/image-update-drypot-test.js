'use strict';

const assert = require('assert');
const init = require('../base/init');
const error = require('../base/error');
const config = require('../base/config');
const my2 = require('../mysql/my2');
const expb = require('../express/express-base');
const expu = require('../express/express-upload');
const expl = require('../express/express-local');
const userf = require('../user/user-fixture');
const imageb = require('../image/image-base');
const imageu = require('../image/image-update');

before(function (done) {
  config.path = 'config/drypot-test.json';
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
      expl.post('/api/images').field('comment', 'image1').attach('files', 'samples/svg-sample.svg').end(function (err, res) {
        assert.ifError(err);
        assert.ifError(res.body.err);
        var _id = res.body.ids[0];
        imageb.identify(imageb.getPath(_id), function (err, meta) {
          assert.ifError(err);
          expl.put('/api/images/' + _id).field('comment', 'image2').attach('files', 'samples/svg-sample-2.svg').end(function (err, res) {
            assert.ifError(err);
            assert.ifError(res.body.err);
            my2.queryOne('select * from image where id = ?', _id, (err, image) => {
              assert.ifError(err);
              assert.notStrictEqual(image, undefined);
              assert.notStrictEqual(image.cdate, undefined);
              assert.strictEqual(image.comment, 'image2');
              imageb.identify(imageb.getPath(_id), function (err, meta) {
                assert.ifError(err);
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
        assert.ifError(err);
        assert.ifError(res.body.err);
        var _id = res.body.ids[0];
        expl.put('/api/images/' + _id).attach('files', 'samples/640x360.jpg').end(function (err, res) {
          assert.ifError(err);
          assert(res.body.err);
          assert(error.find(res.body.err, 'IMAGE_TYPE'));
          done();
        });
      });
    });
  });
});