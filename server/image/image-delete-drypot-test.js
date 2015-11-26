var fs = require('fs');

var init = require('../base/init');
var error = require('../base/error');
var fs2 = require('../base/fs2');
var config = require('../base/config')({ path: 'config/drypot-test.json' });
var mongob = require('../base/mongo-base')({ dropDatabase: true });
var expb = require('../express/express-base');
var expu = require('../express/express-upload');
var expl = require('../express/express-local');
var userf = require('../user/user-fixture');
var imageb = require('../image/image-base');
var imagen = require('../image/image-new');
var imaged = require('../image/image-delete');
var expect = require('../base/assert2').expect;

before(function (done) {
  init.run(done);
});

before(function (done) {
  imageb.emptyDir(done);
});

var _f1 = 'samples/svg-sample.svg';

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
        expect(err).not.exist;
        expect(res.body.err).not.exist;
        expect(res.body.ids).exist;
        var _id1 = res.body.ids[0];
        expl.post('/api/images').field('comment', 'image2').attach('files', _f1).end(function (err, res) {
          expect(err).not.exist;
          expect(res.body.err).not.exist;
          expect(res.body.ids).exist;
          var _id2 = res.body.ids[0];
          expl.del('/api/images/' + _id1, function (err, res) {
            expect(err).not.exist;
            expect(res.body.err).not.exist;
            expect(imageb.getPath(_id1)).not.pathExist;
            expect(imageb.getPath(_id2)).pathExist;
            done();
          });
        });
      });
    });
  });
});
