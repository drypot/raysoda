'use strict';

var init = require('../base/init');
var error = require('../base/error');
var config = require('../base/config')({ path: 'config/raysoda-test.json' });
var mongo2 = require('../mongo/mongo2')({ dropDatabase: true });
var expb = require('../express/express-base');
var expu = require('../express/express-upload');
var expl = require('../express/express-local');
var userf = require('../user/user-fixture');
var imagen = require('../image/image-new');
var imagev = require('../image/image-view');
var assert = require('assert');
var assert2 = require('../base/assert2');

before(function (done) {
  init.run(done);
});

before(function (done) {
  userf.login('user1', done);
});

describe('get /api/images/:id([0-9]+)', function () {
  describe('getting image', function () {
    it('should succeed', function (done) {
      expl.post('/api/images').field('comment', 'image1').attach('files', 'samples/640x360.jpg').end(function (err, res) {
        assert2.noError(err);
        assert2.empty(res.body.err);
        assert2.ne(res.body.ids, undefined);
        assert2.e(res.body.ids.length, 1);
        var _id = res.body.ids[0];
        expl.get('/api/images/' + _id).end(function (err, res) {
          assert2.noError(err);
          assert2.empty(res.body.err);
          done();
        });
      });
    });
  });
});
