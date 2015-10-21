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
var imageu = require('../image/image-update');
var expect = require('../base/assert2').expect;

before(function (done) {
  init.run(done);
});

describe('put /api/images/id', function () {
  describe('updating with no file', function () {
    before(function (done) {
      userf.login('user1', done);
    });
    it('should succeed', function (done) {
      var _id = _id = imageb.getNewId();
      var form = {
        _id: _id,
        uid: userf.user1._id
      };
      imageb.images.insertOne(form, function (err) {
        expect(err).not.exist;
        expl.put('/api/images/' + _id).field('comment', 'updated with no file').end(function (err, res) {
          expect(err).not.exist;
          expect(res.body.err).not.exist;
          imageb.images.findOne({ _id: _id }, function (err, image) {
            expect(err).not.exist;
            expect(image).exist;
            expect(image.comment).equal('updated with no file');
            done();
          });
        });
      });
    });
  });
  describe('updating with text file', function () {
    before(function (done) {
      userf.login('user1', done);
    });
    it('should fail', function (done) {
      var _id = _id = imageb.getNewId();
      var form = {
        _id: _id,
        uid: userf.user1._id
      };
      imageb.images.insertOne(form, function (err) {
        expect(err).not.exist;
        expl.put('/api/images/' + _id).attach('files', 'server/express/express-upload-f1.txt').end(function (err, res) {
          expect(err).not.exist;
          expect(res.body.err).exist;
          expect(res.body.err).error('IMAGE_TYPE');
          done();
        });
      });
    });
  });
  describe('updating other\'s', function () {
    before(function (done) {
      userf.login('user2', done);
    });
    it('should fail', function (done) {
      var _id = _id = imageb.getNewId();
      var form = {
        _id: _id,
        uid: userf.user1._id
      };
      imageb.images.insertOne(form, function (err) {
        expect(err).not.exist;
        expl.put('/api/images/' + _id).field('comment', 'xxx').end(function (err, res) {
          expect(err).not.exist;
          expect(res.body.err).exist;
          expect(res.body.err).error('NOT_AUTHORIZED');
          done();
        });
      });
    });
  });
});



