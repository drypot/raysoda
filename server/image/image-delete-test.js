var fs = require('fs');

var init = require('../base/init');
var error = require('../base/error');
var fs2 = require('../base/fs2');
var config = require('../base/config')({ path: 'config/test.json' });
var mongob = require('../mongo/mongo-base')({ dropDatabase: true });
var expb = require('../express/express-base');
var expu = require('../express/express-upload');
var expl = require('../express/express-local');
var userf = require('../user/user-fixture');
var imageb = require('../image/image-base');
var imaged = require('../image/image-delete');
var expect = require('../base/assert2').expect;

before(function (done) {
  init.run(done);
});

before(function (done) {
  imageb.emptyDir(done);
});

var _f1 = 'samples/960x540.jpg';

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
        expect(err).not.exist;
        expect(res.body.err).not.exist;
        expect(res.body.ids).exist;
        var _id1 = res.body.ids[0];
        expl.post('/api/images').field('comment', 'image2').attach('files', _f1).end(function (err, res) {
          expect(err).not.exist;
          expect(res.body.err).not.exist;
          expect(res.body.ids).exist;
          var _id2 = res.body.ids[0];
          expl.del('/api/images/' + _id2, function (err, res) {
            expect(err).not.exist;
            expect(res.body.err).not.exist;
            expect(new imageb.FilePath(_id1).path).pathExist;
            expect(new imageb.FilePath(_id2).path).not.pathExist;
            imageb.images.findOne({ _id: _id1 }, function (err, image) {
              expect(err).not.exist;
              expect(image).exist;
              imageb.images.findOne({ _id: _id2 }, function (err, image) {
                expect(err).not.exist;
                expect(image).not.exist;
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
        expect(err).not.exist;
        expl.post('/api/images').field('comment', 'image1').attach('files', _f1).end(function (err, res) {
          expect(err).not.exist;
          expect(res.body.err).not.exist;
          expect(res.body.ids).exist;
          var _id = res.body.ids[0];
          userf.login('admin', function (err) {
            expect(err).not.exist;
            expl.del('/api/images/' + _id, function (err, res) {
              expect(err).not.exist;
              expect(res.body.err).not.exist;
              expect(new imageb.FilePath(_id).path).not.pathExist;
              imageb.images.findOne({ _id: _id }, function (err, image) {
                expect(err).not.exist;
                expect(image).not.exist;
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
        expect(err).not.exist;
        expl.post('/api/images').field('comment', 'image1').attach('files', _f1).end(function (err, res) {
          expect(err).not.exist;
          expect(res.body.err).not.exist;
          expect(res.body.ids).exist;
          var _id = res.body.ids[0];
          userf.login('user2', function (err) {
            expect(err).not.exist;
            expl.del('/api/images/' + _id, function (err, res) {
              expect(err).not.exist;
              expect(res.body.err).exist;
              expect(res.body.err).error('NOT_AUTHORIZED');
              expect(new imageb.FilePath(_id).path).pathExist;
              imageb.images.findOne({ _id: _id }, function (err, image) {
                expect(err).not.exist;
                expect(image).exist;
                done();
              });
            });
          });
        });
      });
    });
  });
});
