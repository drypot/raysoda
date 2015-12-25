'use strict';

var fs = require('fs');

var init = require('../base/init');
var error = require('../base/error');
var fs2 = require('../base/fs2');
var config = require('../base/config')({ path: 'config/raysoda-test.json' });
var mongo2 = require('../mongo/mongo2')({ dropDatabase: true });
var expb = require('../express/express-base');
var expu = require('../express/express-upload');
var expl = require('../express/express-local');
var userf = require('../user/user-fixture');
var imageb = require('../image/image-base');
var imagen = require('../image/image-new');
var assert = require('assert');
var assert2 = require('../base/assert2');

before(function (done) {
  init.run(done);
});

before(function (done) {
  userf.login('user1', done);
});

before(function (done) {
  imageb.emptyDir(done);
});

describe('getPath', function () {
  it('should work for id 1', function () {
    assert2.e(imageb.getDir(1), config.uploadDir + '/public/images/0/0');
    assert2.e(imageb.getPath(1), config.uploadDir + '/public/images/0/0/1.jpg');
    assert2.e(imageb.getDirUrl(1), config.uploadSite + '/images/0/0');
    assert2.e(imageb.getThumbUrl(1), config.uploadSite + '/images/0/0/1.jpg');
  });
  it('should work for id 1 234 567', function () {
    assert2.e(imageb.getDir(1234567), config.uploadDir + '/public/images/1/234');
    assert2.e(imageb.getPath(1234567), config.uploadDir + '/public/images/1/234/1234567.jpg');
    assert2.e(imageb.getDirUrl(1234567), config.uploadSite + '/images/1/234');
    assert2.e(imageb.getThumbUrl(1234567), config.uploadSite + '/images/1/234/1234567.jpg');
  });
});

describe('getTicketCount', function () {
  var _now = new Date();

  function genImage(hours, count, done) {
    var images = [];
    for (var i = 0; i < count; i++) {
      var image = {
        _id: imageb.getNewId(),
        uid: userf.user1._id,
        cdate: new Date(_now.getTime() - (hours * 60 * 60 * 1000))
      };
      images.push(image);
    }
    imageb.images.insertMany(images, done);
  }

  before(function (done) {
    imageb.images.deleteMany(done);
  });
  it('should return ticketMax when clean', function (done) {
    imagen.getTicketCount(_now, userf.user1, function (err, count, hours) {
      assert.ifError(err);
      assert2.e(count, config.ticketMax);
      done();
    });
  });
  it('should return ticketMax when the last image aged', function (done) {
    genImage(config.ticketGenInterval + 1, 1, function (err) {
      assert.ifError(err);
      imagen.getTicketCount(_now, userf.user1, function (err, count, hours) {
        assert.ifError(err);
        assert2.e(count, config.ticketMax);
        done();
      });
    });
  });
  it('should return (ticketMax - 1) when an image uploaded', function (done) {
    genImage(config.ticketGenInterval - 1, 1, function (err) {
      assert.ifError(err);
      imagen.getTicketCount(_now, userf.user1, function (err, count, hours) {
        assert.ifError(err);
        assert2.e(count, config.ticketMax - 1);
        done();
      });
    });
  });
  it('should return 0 with left hours when ticketMax images uploaded', function (done) {
    imageb.images.deleteMany(function (err) {
      assert.ifError(err);
      genImage(config.ticketGenInterval - 3, config.ticketMax, function (err) {
        assert.ifError(err);
        imagen.getTicketCount(_now, userf.user1, function (err, count, hours) {
          assert.ifError(err);
          assert2.e(count, 0);
          assert2.e(hours, 3);
          done();
        });
      });
    });
  });
});

describe('post /api/images', function () {
  describe('posting horizonal image', function () {
    before(function (done) {
      imageb.images.deleteMany(done);
    });
    it('should succeed', function (done) {
      expl.post('/api/images').field('comment', 'h image').attach('files', 'samples/2560x1440.jpg').end(function (err, res) {
        assert.ifError(err);
        assert.ifError(res.body.err);
        assert2.ne(res.body.ids, undefined);
        assert2.e(res.body.ids.length, 1);
        var _id = res.body.ids[0];
        imageb.images.findOne({ _id: _id }, function (err, image) {
          assert.ifError(err);
          assert2.e(image._id, _id);
          assert2.e(image.uid, userf.user1._id);
          assert2.ne(image.cdate, undefined);
          assert2.e(image.comment, 'h image');
          imageb.identify(imageb.getPath(_id), function (err, meta) {
            assert.ifError(err);
            assert2.e(meta.width <= imageb.maxWidth, true);
            assert2.e(meta.height <= imageb.maxWidth, true);
            done();
          });
        });
      });
    });
  });
  describe('posting vertical image', function () {
    before(function (done) {
      imageb.images.deleteMany(done);
    });
    it('should succeed', function (done) {
      expl.post('/api/images').field('comment', 'v image').attach('files', 'samples/1440x2560.jpg').end(function (err, res) {
        assert.ifError(err);
        assert.ifError(res.body.err);
        assert2.ne(res.body.ids, undefined);
        assert2.e(res.body.ids.length, 1);
        var _id = res.body.ids[0];
        imageb.images.findOne({ _id: _id }, function (err, image) {
          assert.ifError(err);
          assert2.e(image._id, _id);
          assert2.e(image.uid, userf.user1._id);
          assert2.ne(image.cdate, undefined);
          assert2.e(image.comment, 'v image');
          imageb.identify(imageb.getPath(_id), function (err, meta) {
            assert.ifError(err);
            assert2.e(meta.width <= imageb.maxWidth, true);
            assert2.e(meta.height <= imageb.maxWidth, true);
            done();
          });
        });
      });
    });
  });
  describe('posting small image', function () {
    before(function (done) {
      imageb.images.deleteMany(done);
    });
    it('should succeed', function (done) {
      expl.post('/api/images').field('comment', 'small image').attach('files', 'samples/640x360.jpg').end(function (err, res) {
        assert.ifError(err);
        assert.ifError(res.body.err);
        assert2.ne(res.body.ids, undefined);
        assert2.e(res.body.ids.length, 1);
        var _id = res.body.ids[0];
        imageb.images.findOne({ _id: _id }, function (err, image) {
          assert.ifError(err);
          assert2.e(image._id, _id);
          assert2.e(image.uid, userf.user1._id);
          assert2.ne(image.cdate, undefined);
          assert2.e(image.comment, 'small image');
          imageb.identify(imageb.getPath(_id), function (err, meta) {
            assert.ifError(err);
            assert2.e(meta.width, 640);
            assert2.e(meta.height, 360);
            done();
          });
        });

      });
    });
  });
  describe('posting too small', function () {
    it('should fail', function (done) {
      expl.post('/api/images').attach('files', 'samples/360x240.jpg').end(function (err, res) {
        assert.ifError(err);
        assert2.ne(res.body.err, undefined);
        assert(error.find(res.body.err, 'IMAGE_SIZE'));
        done();
      });
    });
  });
  describe('posting multiple images', function () {
    before(function (done) {
      imageb.images.deleteMany(done);
    }); 
    it('should succeed', function (done) {
      var post = expl.post('/api/images').field('comment', 'max images');
      for (var i = 0; i < config.ticketMax; i++) {
        post.attach('files', 'samples/640x360.jpg');
      }
      post.end(function (err, res) {
        assert.ifError(err);
        assert.ifError(res.body.err);
        assert2.ne(res.body.ids, undefined);
        assert2.e(res.body.ids.length, config.ticketMax);
        var ids = res.body.ids;
        var _id;
        // first image should exist
        _id = ids[0];
        imageb.images.findOne({ _id: _id }, function (err, image) {
          assert.ifError(err);
          assert2.e(image._id, _id);
          assert2.e(image.uid, userf.user1._id);
          assert2.e(image.comment, 'max images');
          assert2.path(imageb.getPath(_id));
          // third versions should exist
          _id = ids[2];
          imageb.images.findOne({ _id: _id }, function (err, image) {
            assert.ifError(err);
            assert2.e(image._id, _id);
            assert2.e(image.uid, userf.user1._id);
            assert2.e(image.comment, 'max images');
            assert2.path(imageb.getPath(_id));
            done();
          });
        });
      });
    });
    it('should fail when posting one more', function (done) {
      expl.post('/api/images').attach('files', 'samples/640x360.jpg').end(function (err, res) {
        assert.ifError(err);
        assert.ifError(res.body.err);
        assert2.ne(res.body.ids, undefined);
        assert2.e(res.body.ids.length, 0);
        done();
      });
    });
  });
  describe('posting plain text file', function () {
    before(function (done) {
      imageb.images.deleteMany(done);
    });
    it('should fail', function (done) {
      imageb.images.deleteMany(function (err) {
        assert.ifError(err);
        expl.post('/api/images').attach('files', 'server/express/express-upload-f1.txt').end(function (err, res) {
          assert.ifError(err);
          assert2.ne(res.body.err, undefined);
          assert(error.find(res.body.err, 'IMAGE_TYPE'));
          done();
        });
      });
    });
  });
  describe('posting with no file', function () {
    before(function (done) {
      imageb.images.deleteMany(done);
    });
    it('should fail', function (done) {
      var form = { };
      imageb.images.deleteMany(function (err) {
        assert.ifError(err);
        expl.post('/api/images').send(form).end(function (err, res) {
          assert.ifError(err);
          assert2.ne(res.body.err, undefined);
          assert(error.find(res.body.err, 'IMAGE_NO_FILE'));
          done();
        });
      });
    });
  });
});
