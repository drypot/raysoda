import * as assert2 from "../base/assert2.mjs";
import * as init from "../base/init.mjs";
import * as error from "../base/error.mjs";
import * as config from "../base/config.mjs";
import * as db from '../db/db.mjs';
import * as expb from '../express/express-base.mjs';
import * as expu from '../express/express-upload.mjs';
import * as expl from '../express/express-local.mjs';
import * as userf from '../user/user-fixture.mjs';
import * as imagen from '../image/image-new.mjs';
import * as imagev from '../image/image-years.mjs';

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

describe('image years', function () {
  describe('get /images/years', function () {
    it('should succeed', function (done) {
      expl.get('/images/years').end(function (err, res) {
        assert2.ifError(err);
        done();
      });
    });
  });
});
