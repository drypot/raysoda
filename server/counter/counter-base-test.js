var init = require('../base/init');
var error = require('../base/error');
var config = require('../base/config')({ path: 'config/test.json' });
var mongob = require('../mongo/mongo-base')({ dropDatabase: true });
var util2 = require('../base/util2');
var counterb = require('../counter/counter-base');
var expect = require('../base/assert2').expect;

before(function (done) {
  init.run(done);
});

describe('counterb.counters', function () {
  it('should exist', function () {
    expect(counterb.counters).exist;
  });
});

describe('.update(id)', function () {
  it('should succeed for new', function (done) {
    counterb.update('nodate', function (err) {
      expect(err).not.exist;
      counterb.counters.findOne({ id: 'nodate' }, function (err, c) {
        expect(err).not.exist;
        expect(c.id).equal('nodate');
        expect(c.d).undefined;
        expect(c.c).equal(1);
        done();
      });
    });
  });
  it('should succeed for existing', function (done) {
    counterb.update('nodate', function (err) {
      expect(err).not.exist;
      counterb.counters.findOne({ id: 'nodate' }, function (err, c) {
        expect(err).not.exist;
        expect(c.id).equal('nodate');
        expect(c.d).undefined;
        expect(c.c).equal(2);
        done();
      });
    });
  });
});

describe('.update(id, date)', function () {
  var today = util2.today();
  it('should succeed for new', function (done) {
    counterb.update('today', today, function (err) {
      expect(err).not.exist;
      counterb.counters.findOne({ id: 'today', d: today }, function (err, c) {
        expect(err).not.exist;
        expect(c.id).equal('today');
        expect(c.d).deep.equal(today);
        expect(c.c).equal(1);
        done();
      });
    });
  });
  it('should succeed for existing', function (done) {
    counterb.update('today', today, function (err) {
      expect(err).not.exist;
      counterb.counters.findOne({ id: 'today', d: today }, function (err, c) {
        expect(err).not.exist;
        expect(c.id).equal('today');
        expect(c.d).deep.equal(today);
        expect(c.c).equal(2);
        done();
      });
    });
  });
});
