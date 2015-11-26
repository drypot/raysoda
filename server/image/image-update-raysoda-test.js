var fs = require('fs');

var init = require('../base/init');
var error = require('../base/error');
var fs2 = require('../base/fs2');
var config = require('../base/config')({ path: 'config/test.json' });
var mongob = require('../base/mongo-base')({ dropDatabase: true });
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
  before(function (done) {
    imageb.emptyDir(done);
  });
  before(function (done) {
    userf.login('user1', done);
  });
  it('should succeed', function (done) {
    expl.post('/api/images').field('comment', 'image1').attach('files', 'samples/3264x2448.jpg').end(function (err, res) {
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
          expect(meta.width).equal(1080);
          expect(meta.height).equal(810);
          expl.put('/api/images/' + _id).field('comment', 'image2').attach('files', 'samples/2448x3264.jpg').end(function (err, res) {
            expect(err).not.exist;
            expect(res.body.err).not.exist;
            imageb.images.findOne({ _id: _id }, function (err, image) {
              expect(err).not.exist;
              expect(image).exist;
              expect(image.cdate).exist;
              expect(image.comment).equal('image2');
              imageb.identify(imageb.getPath(_id), function (err, meta) {
                expect(err).not.exist;
                expect(meta.width).equal(810);
                expect(meta.height).equal(1080);
                done();
              });
            });
          });
        });
      });
    });
  });
  it('should fail with small image', function (done) {
    var form = {
      _id: _id = imageb.getNewId(),
      uid: userf.user1._id
    };
    imageb.images.insertOne(form, function (err) {
      expect(err).not.exist;
      expl.put('/api/images/' + _id).attach('files', 'samples/360x240.jpg').end(function (err, res) {
        expect(err).not.exist;
        expect(res.body.err).exist;
        expect(res.body.err).error('IMAGE_SIZE');
        done();
      });
    });
  });
});
