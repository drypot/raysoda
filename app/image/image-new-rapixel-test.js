'use strict';

const assert = require('assert');
const assert2 = require('../base/assert2');
const init = require('../base/init');
const error = require('../base/error');
const config = require('../base/config');
const my2 = require('../mysql/my2');
const expb = require('../express/express-base');
const expu = require('../express/express-upload');
const expl = require('../express/express-local');
const userf = require('../user/user-fixture');
const imageb = require('../image/image-base');
const imagen = require('../image/image-new');

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

describe('getDir()', function () {
  it('should work for id 1', function () {
    assert.strictEqual(imageb.getDir(1), config.uploadDir + '/public/images/0/0/1');
    assert.strictEqual(imageb.getPath(1, 640), config.uploadDir + '/public/images/0/0/1/1-640.jpg');
    assert.strictEqual(imageb.getDirUrl(1), config.uploadSite + '/images/0/0/1');
    assert.strictEqual(imageb.getThumbUrl(1), config.uploadSite + '/images/0/0/1/1-2560.jpg');
  });
  it('should work for id 1 234 567', function () {
    assert.strictEqual(imageb.getDir(1234567), config.uploadDir + '/public/images/1/234/567');
    assert.strictEqual(imageb.getPath(1234567, 640), config.uploadDir + '/public/images/1/234/567/1234567-640.jpg');
    assert.strictEqual(imageb.getDirUrl(1234567), config.uploadSite + '/images/1/234/567');
    assert.strictEqual(imageb.getThumbUrl(1234567), config.uploadSite + '/images/1/234/567/1234567-2560.jpg');
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
        assert.notStrictEqual(res.body.ids, undefined);
        assert.strictEqual(res.body.ids.length, 1);
        var _id = res.body.ids[0];
        imageb.images.findOne({ _id: _id }, function (err, image) {
          assert.ifError(err);
          assert.strictEqual(image.id, _id);
          assert.strictEqual(image.uid, userf.user1.id);
          //assert.deepStrictEqual(image.vers, [ 5120, 4096, 2560, 1920, 1280 ]);
          assert.deepStrictEqual(image.vers, [ 5120, 4096, 2560, 1280]);
          assert.notStrictEqual(image.cdate, undefined);
          assert.strictEqual(image.comment, 'image1');
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
        assert(res.body.err);
        assert(error.find(res.body.err, 'IMAGE_SIZE'));
        done();
      });
    });
  });
});
