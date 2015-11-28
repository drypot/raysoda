var expect = require('../base/assert2').expect;;

var init = require('../base/init');
var error = require('../base/error');
var config = require('../base/config')({ path: 'config/raysoda-test.json' });
var mongo2 = require('../base/mongo2')({ dropDatabase: true });
var expb = require('../express/express-base');
var expl = require('../express/express-local');
var userb = require('../user/user-base');
var userf = require('../user/user-fixture');
var imagelu = require('../image/image-listu');

before(function (done) {
  init.run(done);
});

describe('get /users/:id([0-9]+)', function () {
  it('should succeed', function (done) {
    expl.get('/users/1').end(function (err, res) {
      expect(err).not.exist;
      expect(res.body.err).not.exist;
      done();
    });
  });
});

describe('get /:name([^/]+)', function () {
  it('should succeed for /user1', function (done) {
    expl.get('/user1').end(function (err, res) {
      expect(err).not.exist;
      expect(res.body.err).not.exist;
      done();
    });
  });
  it('should succeed for /USER1', function (done) {
    expl.get('/USER1').end(function (err, res) {
      expect(err).not.exist;
      expect(res.body.err).not.exist;
      done();
    });
  });
  it('should fail with invalid name', function (done) {
    expl.get('/xman').end(function (err, res) {
      expect(err).exist;
      done();
    });
  });
});