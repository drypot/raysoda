var fs = require('fs');

var init = require('../base/init');
var error = require('../base/error');
var fs2 = require('../base/fs2');
var config = require('../base/config')({ path: 'config/test.json' });
var mongob = require('../mongo/mongo-base')({ dropDatabase: true });
var expb = require('../express/express-base');
var expu = require('../express/express-upload');
var userf = require('../user/user-fixture');
var imageb = require('../image/image-base');
var imageu = require('../image/image-update');
var expl = require('../express/express-local');
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

describe('updating with image', function () {
  var _id;
  it('given post', function (done) {
    expl.post('/api/images').field('comment', 'image1').attach('files', 'samples/3264x2448.jpg').end(function (err, res) {
      expect(err).not.exist;
      expect(res.body.err).not.exist;
      expect(res.body.ids).exist;
      expect(res.body.ids.length).equal(1);
      _id = res.body.ids[0];
      done();
    });
  });
  it('image should exist', function (done) {
    imageb.images.findOne({ _id: _id }, function (err, image) {
      expect(err).not.exist;
      expect(image).exist;
      expect(image.cdate).exist;
      expect(image.comment).equal('image1');
      var save = new imageb.FilePath(_id);
      imageb.identify(save.path, function (err, meta) {
        expect(err).not.exist;
        expect(meta.width).equal(1080);
        expect(meta.height).equal(810);
        done();
      });
    });
  });
  it('updating should success', function (done) {
    expl.put('/api/images/' + _id).field('comment', 'image2').attach('files', 'samples/2448x3264.jpg').end(function (err, res) {
      expect(err).not.exist;
      expect(res.body.err).not.exist;
      done();
    });
  });
  it('image should have been changed', function (done) {
    imageb.images.findOne({ _id: _id }, function (err, image) {
      expect(err).not.exist;
      expect(image).exist;
      expect(image.cdate).exist;
      expect(image.comment).equal('image2');
      var save = new imageb.FilePath(_id);
      imageb.identify(save.path, function (err, meta) {
        expect(err).not.exist;
        expect(meta.width).equal(810);
        expect(meta.height).equal(1080);
        done();
      });
    });
  });
});

describe('updating with too small image', function () {
  var _id;
  it('given post', function (done) {
    var form = {
      _id: _id = imageb.getNewId(),
      uid: userf.user1._id
    };
    imageb.images.insertOne(form, done);
  });
  it('should fail', function (done) {
    expl.put('/api/images/' + _id).attach('files', 'samples/360x240.jpg').end(function (err, res) {
      expect(err).not.exist;
      expect(res.body.err).exist;
      expect(res.body.err).error('IMAGE_SIZE');
      done();
    });
  });
});
