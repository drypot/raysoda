var init = require('../base/init');
var error = require('../base/error');
var config = require('../base/config')({ path: 'config/test.json' });
var mongop = require('../mongo/mongo')({ dropDatabase: true });
var utilp = require('../base/util');
var counter = require('../counter/counter');
var expect = require('../base/assert').expect;

before(function (done) {
  init.run(done);
});

describe('counters', function () {
  it('should exist', function () {
    expect(counter.counters).exist;
  });
});

describe('counter', function () {
  it('creating should success', function (done) {
    counter.update('nodate', done);
  });
  it('can be checked', function (done) {
    counter.counters.findOne({ _id: 'nodate' }, function (err, c) {
      expect(err).not.exist;
      expect(c._id).equal('nodate');
      expect(c.c).equal(1);
      done();
    });
  });
  it('increasing should success', function (done) {
    counter.update('nodate', done);
  });
  it('can be checked', function (done) {
    counter.counters.findOne({ _id: 'nodate' }, function (err, c) {
      expect(err).not.exist;
      expect(c._id).equal('nodate');
      expect(c.c).equal(2);
      done();
    });
  });
});

describe('daily counter', function () {
  var d = utilp.toDateStringNoDash(new Date());
  it('creating should success', function (done) {
    counter.updateDaily('today', done);
  });
  it('can be checked', function (done) {
    counter.counters.findOne({ _id: 'today' + d }, function (err, c) {
      expect(err).not.exist;
      expect(c._id).equal('today' + d);
      expect(c.c).equal(1);
      done();
    });
  });
  it('increasing should success', function (done) {
    counter.updateDaily('today', done);
  });
  it('can be checked', function (done) {
    counter.counters.findOne({ _id: 'today' + d }, function (err, c) {
      expect(err).not.exist;
      expect(c._id).equal('today' + d);
      expect(c.c).equal(2);
      done();
    });
  });
});
