
import * as assert2 from "../base/assert2.mjs";
import * as init from "../base/init.mjs";
import * as config from "../base/config.mjs";
import * as db from '../db/db.mjs';
import * as expb from '../express/express-base.mjs';
import * as expu from '../express/express-upload.mjs';
import * as expl from '../express/express-local.mjs';
import * as userf from '../user/user-fixture.mjs';
import * as imageb from '../image/image-base.mjs';
import * as imagen from '../image/image-new.mjs';
import * as imaged from '../image/image-delete.mjs';

before(function (done) {
  config.setPath('config/osoky-test.json');
  db.setDropDatabase(true);
  init.run(done);
});

before((done) => {
  expb.start();
  done();
});

before(function (done) {
  imageb.emptyDir(done);
});

const _f1 = 'samples/2560x1440.jpg';

describe('del /api/images/[_id]', function () {
  describe('deleting mine', function () {
    before(function (done) {
      db.query('truncate table image', done);
    });
    before(function (done) {
      userf.login('user1', done);
    });
    it('should succeed', function (done) {
      expl.post('/api/images').field('comment', 'image1').attach('files', _f1).end(function (err, res) {
        assert2.ifError(err);
        assert2.ifError(res.body.err);
        assert2.ne(res.body.ids, undefined);
        const _id1 = res.body.ids[0];
        expl.post('/api/images').field('comment', 'image2').attach('files', _f1).end(function (err, res) {
          assert2.ifError(err);
          assert2.ifError(res.body.err);
          assert2.ne(res.body.ids, undefined);
          const _id2 = res.body.ids[0];
          expl.del('/api/images/' + _id1, function (err, res) {
            assert2.ifError(err);
            assert2.ifError(res.body.err);
            assert2.path(imageb.fman.getPath(_id1), false);
            assert2.path(imageb.fman.getPath(_id2));
            done();
          });
        });
      });
    });
  });
});
