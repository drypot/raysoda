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
const imaged = require('../image/image-delete');

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
      my2.query('truncate table image', done);
    });
    before(function (done) {
      userf.login('user1', done);
    });
    it('should succeed', function (done) {
      expl.post('/api/images').field('comment', 'image1').attach('files', _f1).end(function (err, res) {
        assert.ifError(err);
        assert.ifError(res.body.err);
        assert.notStrictEqual(res.body.ids, undefined);
        var _id1 = res.body.ids[0];
        expl.post('/api/images').field('comment', 'image2').attach('files', _f1).end(function (err, res) {
          assert.ifError(err);
          assert.ifError(res.body.err);
          assert.notStrictEqual(res.body.ids, undefined);
          var _id2 = res.body.ids[0];
          expl.del('/api/images/' + _id1, function (err, res) {
            assert.ifError(err);
            assert.ifError(res.body.err);
            assert2.path(imageb.getPath(_id1), false);
            assert2.path(imageb.getPath(_id2));
            my2.queryOne('select * from image where id = ?', _id1, (err, image) => {
              assert.ifError(err);
              assert.strictEqual(image, undefined);
              my2.queryOne('select * from image where id = ?', _id2, (err, image) => {
                assert.ifError(err);
                assert.notStrictEqual(image, undefined);
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
      my2.query('truncate table image', done);
    });
    it('should succeed', function (done) {
      userf.login('user1', function (err) {
        assert.ifError(err);
        expl.post('/api/images').field('comment', 'image1').attach('files', _f1).end(function (err, res) {
          assert.ifError(err);
          assert.ifError(res.body.err);
          assert.notStrictEqual(res.body.ids, undefined);
          var _id = res.body.ids[0];
          userf.login('admin', function (err) {
            assert.ifError(err);
            expl.del('/api/images/' + _id, function (err, res) {
              assert.ifError(err);
              assert.ifError(res.body.err);
              assert2.path(imageb.getPath(_id), false);
              my2.queryOne('select * from image where id = ?', _id, (err, image) => {
                assert.ifError(err);
                assert.strictEqual(image, undefined);
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
      my2.query('truncate table image', done);
    });
    it('should fail', function (done) {
      userf.login('user1', function (err) {
        assert.ifError(err);
        expl.post('/api/images').field('comment', 'image1').attach('files', _f1).end(function (err, res) {
          assert.ifError(err);
          assert.ifError(res.body.err);
          assert.notStrictEqual(res.body.ids, undefined);
          var _id = res.body.ids[0];
          userf.login('user2', function (err) {
            assert.ifError(err);
            expl.del('/api/images/' + _id, function (err, res) {
              assert.ifError(err);
              assert(res.body.err);
              assert(error.find(res.body.err, 'NOT_AUTHORIZED'));
              assert2.path(imageb.getPath(_id));
              my2.queryOne('select * from image where id = ?', _id, (err, image) => {
                assert.ifError(err);
                assert.notStrictEqual(image, undefined);
                done();
              });
            });
          });
        });
      });
    });
  });
});
