import * as assert2 from "../base/assert2.js";
import * as init from "../base/init.js";
import * as error from "../base/error.js";
import * as config from "../base/config.js";
import * as db from '../db/db.js';
import * as expb from '../express/express-base.js';
import * as expu from '../express/express-upload.js';
import * as expl from '../express/express-local.js';
import * as userf from '../user/user-fixture.js';
import * as imageb from '../image/image-base.js';
import * as imageu from '../image/image-update.js';

before(function (done) {
  config.setPath('config/drypot-test.json');
  db.setDropDatabase(true);
  init.run(done);
});

before((done) => {
  expb.start();
  done();
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
        assert2.ifError(err);
        assert2.ifError(res.body.err);
        const _id = res.body.ids[0];
        imageb.identify(imageb.fman.getPath(_id), function (err, meta) {
          assert2.ifError(err);
          expl.put('/api/images/' + _id).field('comment', 'image2').attach('files', 'samples/svg-sample-2.svg').end(function (err, res) {
            assert2.ifError(err);
            assert2.ifError(res.body.err);
            db.queryOne('select * from image where id = ?', _id, (err, image) => {
              assert2.ifError(err);
              assert2.ne(image, undefined);
              assert2.ne(image.cdate, undefined);
              assert2.e(image.comment, 'image2');
              imageb.identify(imageb.fman.getPath(_id), function (err, meta) {
                assert2.ifError(err);
                done();
              });
            });
          });
        });
      });
    });
  });
  describe('updating with jpg', function () {
    it('should fail', function (done) {
      expl.post('/api/images').field('comment', 'image1').attach('files', 'samples/svg-sample.svg').end(function (err, res) {
        assert2.ifError(err);
        assert2.ifError(res.body.err);
        const _id = res.body.ids[0];
        expl.put('/api/images/' + _id).attach('files', 'samples/640x360.jpg').end(function (err, res) {
          assert2.ifError(err);
          assert2.ok(res.body.err);
          assert2.ok(error.find(res.body.err, 'IMAGE_TYPE'));
          done();
        });
      });
    });
  });
});
