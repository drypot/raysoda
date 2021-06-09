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
import * as imagev from '../image/image-years.js';

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
