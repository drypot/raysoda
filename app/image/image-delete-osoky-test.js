'use strict';

const fs = require('fs');

const init = require('../base/init');
const error = require('../base/error');
const fs2 = require('../base/fs2');
const config = require('../base/config');
const mysql2 = require('../mysql/mysql2');
const expb = require('../express/express-base');
const expu = require('../express/express-upload');
const expl = require('../express/express-local');
const userf = require('../user/user-fixture');
const imageb = require('../image/image-base');
const imagen = require('../image/image-new');
const imaged = require('../image/image-delete');
const assert = require('assert');
const assert2 = require('../base/assert2');

before(function (done) {
  config.path = 'config/osoky-test.json';
  mysql2.dropDatabase = true;
  init.run(done);
});

before((done) => {
  expb.start();
  done();
});

before(function (done) {
  imageb.emptyDir(done);
});

var _f1 = 'samples/2560x1440.jpg';

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
        assert2.empty(res.body.err);
        assert2.ne(res.body.ids, undefined);
        var _id1 = res.body.ids[0];
        expl.post('/api/images').field('comment', 'image2').attach('files', _f1).end(function (err, res) {
          assert.ifError(err);
          assert2.empty(res.body.err);
          assert2.ne(res.body.ids, undefined);
          var _id2 = res.body.ids[0];
          expl.del('/api/images/' + _id1, function (err, res) {
            assert.ifError(err);
            assert2.empty(res.body.err);
            assert2.path(imageb.getPath(_id1), false);
            assert2.path(imageb.getPath(_id2));
            done();
          });
        });
      });
    });
  });
});
