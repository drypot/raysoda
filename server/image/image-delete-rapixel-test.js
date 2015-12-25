'use strict';

var fs = require('fs');

var init = require('../base/init');
var error = require('../base/error');
var fs2 = require('../base/fs2');
var config = require('../base/config')({ path: 'config/rapixel-test.json' });
var mongo2 = require('../mongo/mongo2')({ dropDatabase: true });
var expb = require('../express/express-base');
var expu = require('../express/express-upload');
var expl = require('../express/express-local');
var userf = require('../user/user-fixture');
var imageb = require('../image/image-base');
var imagen = require('../image/image-new');
var imaged = require('../image/image-delete');
var assert = require('assert');
var assert2 = require('../base/assert2');

before(function (done) {
  init.run(done);
});

before(function (done) {
  imageb.emptyDir(done);
});

var _f1 = 'samples/4096x2304.jpg';

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
            assert2.path(imageb.getDir(_id1), false);
            assert2.path(imageb.getDir(_id2));
            done();
          });
        });
      });
    });
  });
});
