'use strict';

var fs = require('fs');

var init = require('../base/init');
var error = require('../base/error');
var fs2 = require('../base/fs2');
var config = require('../base/config')({ path: 'config/rapixel-test.json' });
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
      expl.post('/api/images').field('comment', 'image1').attach('files', 'samples/5120x2880.jpg').end(function (err, res) {
        expect(err).not.exist;
        expect(res.body.err).not.exist;
        var _id = res.body.ids[0];
        imageb.images.findOne({ _id: _id }, function (err, image) {
          expect(err).not.exist;
          expect(image).exist;
          //expect(image.vers).eql([ 5120, 4096, 2560, 1920, 1280 ]);
          expect(image.vers).eql([ 5120, 4096, 2560, 1280]);
          expect(image.comment).equal('image1');
          expect(imageb.getPath(_id, 5120)).pathExist;
          expect(imageb.getPath(_id, 4096)).pathExist;
          expect(imageb.getPath(_id, 2560)).pathExist;
          expect(imageb.getPath(_id, 1280)).pathExist;
          fs2.emptyDir(imageb.getDir(_id), function (err) {
            if (err) return done(err);
            expl.put('/api/images/' + _id).field('comment', 'image2').attach('files', 'samples/4096x2304.jpg').end(function (err, res) {
              expect(err).not.exist;
              expect(res.body.err).not.exist;
              imageb.images.findOne({ _id: _id }, function (err, image) {
                expect(err).not.exist;
                expect(image).exist;
                //expect(image.vers).eql([ 4096, 2560, 1920, 1280 ]);
                expect(image.vers).eql([ 4096, 2560, 1280 ]);
                expect(image.comment).equal('image2');
                expect(imageb.getPath(_id, 5120)).not.pathExist;
                expect(imageb.getPath(_id, 4096)).pathExist;
                expect(imageb.getPath(_id, 2560)).pathExist;
                expect(imageb.getPath(_id, 1280)).pathExist;
                done();
              });
            });
          });
        });
      });
    });
  });
  describe('updating with small image', function () {
    it('should fail', function (done) {
      expl.post('/api/images').field('comment', 'image1').attach('files', 'samples/5120x2880.jpg').end(function (err, res) {
        expect(err).not.exist;
        expect(res.body.err).not.exist;
        var _id = res.body.ids[0];
        expl.put('/api/images/' + _id).attach('files', 'samples/2560x1440.jpg').end(function (err, res) {
          expect(err).not.exist;
          expect(res.body.err).exist;
          expect(res.body.err).error('IMAGE_SIZE');
          done();
        });
      });
    });
  });
});
