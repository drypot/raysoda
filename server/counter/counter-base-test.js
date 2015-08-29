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

describe('counters', function () {
  it('should exist', function () {
    expect(counterb.counters).exist;
  });
});

describe('counter', function () {
  it('creating should success', function (done) {
    counterb.update('nodate', done);
  });
  it('can be checked', function (done) {
    counterb.counters.findOne({ _id: 'nodate' }, function (err, c) {
      expect(err).not.exist;
      expect(c._id).equal('nodate');
      expect(c.c).equal(1);
      done();
    });
  });
  it('increasing should success', function (done) {
    counterb.update('nodate', done);
  });
  it('can be checked', function (done) {
    counterb.counters.findOne({ _id: 'nodate' }, function (err, c) {
      expect(err).not.exist;
      expect(c._id).equal('nodate');
      expect(c.c).equal(2);
      done();
    });
  });
});

describe('daily counter', function () {
  var d = util2.toDateStringNoDash(new Date());
  it('creating should success', function (done) {
    counterb.updateDaily('today', done);
  });
  it('can be checked', function (done) {
    counterb.counters.findOne({ _id: 'today' + d }, function (err, c) {
      expect(err).not.exist;
      expect(c._id).equal('today' + d);
      expect(c.c).equal(1);
      done();
    });
  });
  it('increasing should success', function (done) {
    counterb.updateDaily('today', done);
  });
  it('can be checked', function (done) {
    counterb.counters.findOne({ _id: 'today' + d }, function (err, c) {
      expect(err).not.exist;
      expect(c._id).equal('today' + d);
      expect(c.c).equal(2);
      done();
    });
  });
});
