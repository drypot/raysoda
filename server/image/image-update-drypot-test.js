var fs = require('fs');

var init = require('../base/init');
var error = require('../base/error');
var fs2 = require('../base/fs2');
var config = require('../base/config')({ path: 'config/drypot-test.json' });
var mongo2 = require('../base/mongo2')({ dropDatabase: true });
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
        expect(err).not.exist;
        expect(res.body.err).not.exist;
        expect(res.body.ids).exist;
        expect(res.body.ids.length).equal(1);
        var _id = res.body.ids[0];
        imageb.images.findOne({ _id: _id }, function (err, image) {
          expect(err).not.exist;
          expect(image).exist;
          expect(image.cdate).exist;
          expect(image.comment).equal('image1');
          imageb.identify(imageb.getPath(_id), function (err, meta) {
            expect(err).not.exist;
            expl.put('/api/images/' + _id).field('comment', 'image2').attach('files', 'samples/svg-sample-2.svg').end(function (err, res) {
              expect(err).not.exist;
              expect(res.body.err).not.exist;
              imageb.images.findOne({ _id: _id }, function (err, image) {
                expect(err).not.exist;
                expect(image).exist;
                expect(image.cdate).exist;
                expect(image.comment).equal('image2');
                imageb.identify(imageb.getPath(_id), function (err, meta) {
                  expect(err).not.exist;
                  done();
                });
              });
            });
          });
        });
      });
    });
  });
  describe('updating with jpg', function () {
    it('should fail', function (done) {
      var form = {
        _id: _id = imageb.getNewId(),
        uid: userf.user1._id
      };
      imageb.images.insertOne(form, function (err) {
        expect(err).not.exist;
        expl.put('/api/images/' + _id).attach('files', 'samples/640x360.jpg').end(function (err, res) {
          expect(err).not.exist;
          expect(res.body.err).exist;
          expect(res.body.err).error('IMAGE_TYPE');
          done();
        });
      });
    });
  });
});
