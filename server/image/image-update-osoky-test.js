var fs = require('fs');

var init = require('../base/init');
var error = require('../base/error');
var fs2 = require('../base/fs2');
var config = require('../base/config')({ path: 'config/osoky-test.json' });
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

describe('updating with image', function () {
  var _id;
  it('given post', function (done) {
    expl.post('/api/images').field('comment', 'image1').attach('files', 'samples/1280x720.jpg').end(function (err, res) {
      expect(err).not.exist;
      expect(res.body.err).not.exist;
      expect(res.body.ids).exist;
      expect(res.body.ids.length).equal(1);
      _id = res.body.ids[0];
      done();
    });
  });
  it('can be checked', function (done) {
    imageb.images.findOne({ _id: _id }, function (err, image) {
      expect(err).not.exist;
      expect(image).exist;
      expect(image.fname).equal('1280x720.jpg');
      expect(image.format).equal('jpeg');
      expect(image.width).equal(1280);
      expect(image.vers).eql([ 720, 640 ]);
      expect(image.cdate).exist;
      expect(image.comment).equal('image1');
      expect(imageb.getPath(_id)).pathExist;
      done();
    });
  });
  it('should succeed', function (done) {
    expl.put('/api/images/' + _id).field('comment', 'image2').attach('files', 'samples/1136x640.jpg').end(function (err, res) {
      expect(err).not.exist;
      expect(res.body.err).not.exist;
      done();
    });
  });
  it('can be checked', function (done) {
    imageb.images.findOne({ _id: _id }, function (err, image) {
      expect(err).not.exist;
      expect(image).exist;
      expect(image.fname).equal('1136x640.jpg');
      expect(image.format).equal('jpeg');
      expect(image.width).equal(1136);
      expect(image.vers).eql([ 640 ]);
      expect(image.cdate).exist;
      expect(image.comment).equal('image2');
      expect(imageb.getPath(_id)).pathExist;
      done();
    });
  });
});

describe('updating with small image', function () {
  var _id;
  it('given post', function (done) {
    var form = {
      _id: _id = imageb.getNewId(),
      uid: userf.user1._id
    };
    imageb.images.insertOne(form, done);
  });
  it('should fail', function (done) {
    expl.put('/api/images/' + _id).attach('files', 'samples/640x360.jpg').end(function (err, res) {
      expect(err).not.exist;
      expect(res.body.err).exist;
      expect(res.body.err).error('IMAGE_SIZE');
      done();
    });
  });
});