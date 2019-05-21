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
const imagen = require('../image/image-new');

before(function (done) {
  config.path = 'config/osoky-test.json';
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
    assert.strictEqual(imageb.getDir(1), config.uploadDir + '/public/images/0/0');
    assert.strictEqual(imageb.getPath(1), config.uploadDir + '/public/images/0/0/1.jpg');
    assert.strictEqual(imageb.getUrlDir(1), config.uploadSite + '/images/0/0');
    assert.strictEqual(imageb.getThumbUrl(1), config.uploadSite + '/images/0/0/1.jpg');
  });
  it('should work for id 1 234 567', function () {
    assert.strictEqual(imageb.getDir(1234567), config.uploadDir + '/public/images/1/234');
    assert.strictEqual(imageb.getPath(1234567), config.uploadDir + '/public/images/1/234/1234567.jpg');
    assert.strictEqual(imageb.getUrlDir(1234567), config.uploadSite + '/images/1/234');
    assert.strictEqual(imageb.getThumbUrl(1234567), config.uploadSite + '/images/1/234/1234567.jpg');
  });
});

describe('post /api/images', function () {
  describe('posting big', function () {
    before(function (done) {
      my2.query('truncate table image', done);
    });
    it('should succeed', function (done) {
      expl.post('/api/images').field('comment', 'image1').attach('files', 'samples/4096x2304.jpg').end(function (err, res) {
        assert.ifError(err);
        assert.ifError(res.body.err);
        assert.notStrictEqual(res.body.ids, undefined);
        assert.strictEqual(res.body.ids.length, 1);
        var _id = res.body.ids[0];
        my2.queryOne('select * from image where id = ?', _id, (err, image) => {
          assert.ifError(err);
          assert.strictEqual(image.id, _id);
          assert.strictEqual(image.uid, userf.user1.id);
          assert.notStrictEqual(image.cdate, undefined);
          assert.strictEqual(image.comment, 'image1');
          imageb.identify(imageb.getPath(_id), function (err, meta) {
            assert.ifError(err);
            assert.strictEqual(meta.width, imageb.maxWidth);
            assert.strictEqual(meta.height, imageb.maxWidth);
            done();
          });
        });
      });
    });
  });
  describe('posting small', function () {
    before(function (done) {
      my2.query('truncate table image', done);
    });
    it('should succeed', function (done) {
      expl.post('/api/images').field('comment', 'image1').attach('files', 'samples/1280x720.jpg').end(function (err, res) {
        assert.ifError(err);
        assert.ifError(res.body.err);
        assert.notStrictEqual(res.body.ids, undefined);
        assert.strictEqual(res.body.ids.length, 1);
        var _id = res.body.ids[0];
        my2.queryOne('select * from image where id = ?', _id, (err, image) => {
          assert.ifError(err);
          assert.strictEqual(image.id, _id);
          assert.strictEqual(image.uid, userf.user1.id);
          assert.notStrictEqual(image.cdate, undefined);
          assert.strictEqual(image.comment, 'image1');
          imageb.identify(imageb.getPath(_id), function (err, meta) {
            assert.ifError(err);
            assert.strictEqual(meta.width, 720);
            assert.strictEqual(meta.height, 720);
            done();
          });
        });
      });
    });
  });
  describe('posting too small', function () {
    before(function (done) {
      my2.query('truncate table image', done);
    });
    it('should fail', function (done) {
      expl.post('/api/images').attach('files', 'samples/640x360.jpg').end(function (err, res) {
        assert.ifError(err);
        assert(res.body.err);
        assert(error.find(res.body.err, 'IMAGE_SIZE'));
        done();
      });
    });
  });
});
