var init = require('../base/init');
var error = require('../base/error');
var config = require('../base/config')({ path: 'config/test.json' });
var mongob = require('../mongo/mongo-base')({ dropDatabase: true });
var expl = require('../express/express-local');
var userf = require('../user/user-fixture');
var counterb = require('../counter/counter-base');
var countera = require('../counter/counter-all');
var expect = require('../base/assert2').expect;

before(function (done) {
  init.run(done);
});

describe('counter inc', function () {
  it('counter should not exist', function (done) {
    counterb.find('abc', function (err, c) {
      expect(err).not.exist;
      expect(c).null;
      done();
    });
  });
  it('inc should success', function (done) {
    expl.get('/api/counters/abc/inc?r=http://hello.world').redirects(0).end(function (err, res) {
      expect(err).exist;
      expect(res).redirectTo('http://hello.world');
      done();
    });
  });
  it('counter should be increased', function (done) {
    counterb.find('abc', new Date(), function (err, c) {
      expect(err).not.exist;
      expect(c).equal(1);
      done();
    });
  });
  it('inc should success', function (done) {
    expl.get('/api/counters/abc/inc?r=http://hello.world').redirects(0).end(function (err, res) {
      expect(err).exist;
      expect(res).redirectTo('http://hello.world');
      done();
    });
  });
  it('counter should be increased', function (done) {
    counterb.find('abc', new Date(), function (err, c) {
      expect(err).not.exist;
      expect(c).equal(2);
      done();
    });
  });
});