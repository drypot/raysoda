import * as assert2 from "../base/assert2.js";
import * as init from "../base/init.js";
import * as error from "../base/error.js";
import * as config from "../base/config.js";
import * as db from '../db/db.js';
import * as expb from '../express/express-base.js';
import * as expu from '../express/express-upload.js';
import * as expl from '../express/express-local.js';
import * as userf from '../user/user-fixture.js';
import * as imagen from '../image/image-new.js';
import * as imagev from '../image/image-view.js';

before(function (done) {
  config.setPath('config/raysoda-test.json');
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

describe('get /api/images/:id([0-9]+)', function () {
  describe('getting image', function () {
    it('should succeed', function (done) {
      expl.post('/api/images').field('comment', 'image1').attach('files', 'samples/640x360.jpg').end(function (err, res) {
        assert2.ifError(err);
        assert2.ifError(res.body.err);
        assert2.ne(res.body.ids, undefined);
        assert2.e(res.body.ids.length, 1);
        const _id = res.body.ids[0];
        expl.get('/api/images/' + _id).end(function (err, res) {
          assert2.ifError(err);
          assert2.ifError(res.body.err);
          done();
        });
      });
    });
  });
});
