var init = require('../base/init');
var expect = require('../base/assert2').expect;

describe('init.run()', function () {
  it('should work', function (done) {
    var a = [];
    init.reset();
    init.add(function (done) {
      a.push(33);
      done();
    });
    init.add(function (done) {
      a.push(77);
      done();
    });
    init.run(function () {
      expect(a).length(2);
      expect(a[0]).equal(33);
      expect(a[1]).equal(77);
      done();
    });
  });
  it('can pass an error', function (done) {
    var a = [];
    init.reset();
    init.add(function (done) {
      a.push(3);
      done();
    });
    init.add(function (done) {
      try {
        throw new Error('critical');
        done();
      } catch (err) {
        done(err);
      }
    });
    init.run(function (err) {
      expect(a).length(1);
      expect(a[0]).equal(3);
      expect(err).exist;
      done();
    });
  });
});

describe('init.tail()', function () {
  it('should work', function (done) {
    var a = [];
    init.reset();
    init.add(function (done) {
      a.push(3);
      done();
    });
    init.tail(function (done) {
      a.push(10);
      done();
    });
    init.add(function (done) {
      a.push(7);
      done();
    });
    init.run(function () {
      expect(a).length(3);
      expect(a[0]).equal(3);
      expect(a[1]).equal(7);
      expect(a[2]).equal(10);
      done();
    });
  });
});
