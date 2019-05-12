'use strict';

const fs = require('fs');

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
const imagen = require('../image/image-new');
const imaged = require('../image/image-delete');
const assert = require('assert');
const assert2 = require('../base/assert2');

before(function (done) {
  config.path = 'config/raysoda-test.json';
  my2.dropDatabase = true;
  init.run(done);
});

before((done) => {
  expb.start();
  done();
});

before(function (done) {
  imageb.emptyDir(done);
});

var _f1 = 'samples/640x360.jpg';

describe('del /api/images/[_id]', function () {
  describe('deleting mine', function () {
    before(function (done) {
      imageb.images.deleteMany(done);
    });
    before(function (done) {
      userf.login('user1', done);
    });
    it('should succeed', function (done) {
      expl.post('/api/images').field('comment', 'image1').attach('files', _f1).end(function (err, res) {
        assert.ifError(err);
        assert.ifError(res.body.err);
        assert2.ne(res.body.ids, undefined);
        var _id1 = res.body.ids[0];
        expl.post('/api/images').field('comment', 'image2').attach('files', _f1).end(function (err, res) {
          assert.ifError(err);
          assert.ifError(res.body.err);
          assert2.ne(res.body.ids, undefined);
          var _id2 = res.body.ids[0];
          expl.del('/api/images/' + _id1, function (err, res) {
            assert.ifError(err);
            assert.ifError(res.body.err);
            assert2.path(imageb.getPath(_id1), false);
            assert2.path(imageb.getPath(_id2));
            imageb.images.findOne({ _id: _id1 }, function (err, image) {
              assert.ifError(err);
              assert2.e(image, null);
              imageb.images.findOne({ _id: _id2 }, function (err, image) {
                assert.ifError(err);
                assert2.ne(image, undefined);
                done();
              });
            });
          });
        });
      });
    });
  });
  describe('deleting by admin', function () {
    before(function (done) {
      imageb.images.deleteMany(done);
    });
    it('should succeed', function (done) {
      userf.login('user1', function (err) {
        assert.ifError(err);
        expl.post('/api/images').field('comment', 'image1').attach('files', _f1).end(function (err, res) {
          assert.ifError(err);
          assert.ifError(res.body.err);
          assert2.ne(res.body.ids, undefined);
          var _id = res.body.ids[0];
          userf.login('admin', function (err) {
            assert.ifError(err);
            expl.del('/api/images/' + _id, function (err, res) {
              assert.ifError(err);
              assert.ifError(res.body.err);
              assert2.path(imageb.getPath(_id), false);
              imageb.images.findOne({ _id: _id }, function (err, image) {
                assert.ifError(err);
                assert2.e(image, null);
                done();
              });
            });
          });
        });
      });
    });
  });
  describe('deleting other\'s', function () {
    before(function (done) {
      imageb.images.deleteMany(done);
    });
    it('should fail', function (done) {
      userf.login('user1', function (err) {
        assert.ifError(err);
        expl.post('/api/images').field('comment', 'image1').attach('files', _f1).end(function (err, res) {
          assert.ifError(err);
          assert.ifError(res.body.err);
          assert2.ne(res.body.ids, undefined);
          var _id = res.body.ids[0];
          userf.login('user2', function (err) {
            assert.ifError(err);
            expl.del('/api/images/' + _id, function (err, res) {
              assert.ifError(err);
              assert(res.body.err);
              assert(error.find(res.body.err, 'NOT_AUTHORIZED'));
              assert2.path(imageb.getPath(_id));
              imageb.images.findOne({ _id: _id }, function (err, image) {
                assert.ifError(err);
                assert2.ne(image, undefined);
                done();
              });
            });
          });
        });
      });
    });
  });
});
