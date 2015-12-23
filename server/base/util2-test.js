'use strict';

var util2 = require('../base/util2');
var expect = require('../base/assert2').expect;

describe('find', function () {
  it('should succeed', function () {
    var item = util2.find([ 1, 2, 3], function (item) {
      return item === 2;
    });
    expect(item).equal(2);
  });
  it('should succeed', function () {
    var item = util2.find([ 1, 2, 3], function (item) {
      return item === 4;
    });
    expect(item).null;
  });
});

describe('mergeArray', function () {
  function eq(item1, item2) {
    return item1.name === item2.name;
  }
  it('should succeed', function () {
    var obj1 = [];
    var obj2 = [{ name: 'n1', value: 'v1' }];
    util2.mergeArray(obj1, obj2, eq);
    expect(obj1).length(1);
    expect(obj1[0].name).equal('n1');
    expect(obj1[0].value).equal('v1');
  });
  it('should succeed', function () {
    var obj1 = [{ name: 'n1', value: 'v1' }, { name: 'n2', value: 'v2' }];
    var obj2 = [{ name: 'n2', value: 'v2n' }, { name: 'n3', value: 'v3n' }, { name: 'n4', value: 'v4n' }];
    util2.mergeArray(obj1, obj2, eq);
    expect(obj1).length(4);
    expect(obj1[0].name).equal('n1');
    expect(obj1[0].value).equal('v1');
    expect(obj1[1].name).equal('n2');
    expect(obj1[1].value).equal('v2n');
    expect(obj1[2].name).equal('n3');
    expect(obj1[2].value).equal('v3n');
    expect(obj1[3].name).equal('n4');
    expect(obj1[3].value).equal('v4n');
  });
});

describe('fif', function () {
  it('3 func true case should succeed', function () {
    var r;
    util2.fif(true, function (next) {
      r = '123';
      next('456');
    }, function (next) {
      r = 'abc';
      next('def');
    }, function (p) {
      expect(r).equal('123');
      expect(p).equal('456');
    })
  });
  it('3 func false case should succeed', function () {
    var r;
    util2.fif(false, function (next) {
      r = '123';
      next('456');
    }, function (next) {
      r = 'abc';
      next('def');
    }, function (p) {
      expect(r).equal('abc');
      expect(p).equal('def');
    })
  });
  it('2 func true case should succeed', function () {
    var r;
    util2.fif(true, function (next) {
      r = '123';
      next('456');
    }, function (p) {
      expect(r).equal('123');
      expect(p).equal('456');
    })
  });
  it('2 func false case should succeed', function () {
    var r;
    util2.fif(false, function (next) {
      r = '123';
      next('456');
    }, function (p) {
      expect(r).undefined;
      expect(p).undefined;
    })
  });
});

describe('pass', function () {
  it('should succeed', function (done) {
    util2.pass(function (err) {
      expect(err).not.exist;
      done();
    });
  });
  it('should succeed', function (done) {
    util2.pass(1, 2, 3, function (err) {
      expect(err).not.exist;
      done();
    });
  });
});

describe('today', function () {
  it('should succeed', function (done) {
    var now = new Date();
    var today = util2.today();
    expect(today.getFullYear()).equal(now.getFullYear());
    expect(today.getMonth()).equal(now.getMonth());
    expect(today.getDate()).equal(now.getDate());
    expect(today.getHours()).equal(0);
    expect(today.getMinutes()).equal(0);
    expect(today.getSeconds()).equal(0);
    expect(today.getMilliseconds()).equal(0);
    done();
  });
});

describe('dateFromString', function () {
  it('should succeed', function (done) {
    var d = util2.dateFromString('1974-05-16');
    expect(d.getFullYear()).equal(1974);
    expect(d.getMonth()).equal(4);
    expect(d.getDate()).equal(16);
    expect(d.getHours()).equal(0);
    expect(d.getMinutes()).equal(0);
    expect(d.getSeconds()).equal(0);
    expect(d.getMilliseconds()).equal(0);
    done();
  });
});

describe('dateTimeString', function () {
  it('should succeed', function () {
    var d = new Date(1974, 4, 16, 12, 0);
    expect(util2.dateTimeString(d)).equal('1974-05-16 12:00:00');
  });
});

describe('dateString', function () {
  it('should succeed', function () {
    var d = new Date(1974, 4, 16, 12, 0);
    expect(util2.dateString(d)).equal('1974-05-16');
  });
});

describe('dateStringNoDash', function () {
  it('should succeed', function () {
    var d = new Date(1974, 4, 16, 12, 0);
    expect(util2.dateStringNoDash(d)).equal('19740516');
  });
});

describe('url', function () {
  it('should succeed', function () {
    var params = { a: 10 };
    var params2 = { a: 10, b: 'big'};
    expect(util2.url('http://localhost/test')).equal('http://localhost/test');
    expect(util2.url('http://localhost/test', params)).equal('http://localhost/test?a=10');
    expect(util2.url('http://localhost/test', params2)).equal('http://localhost/test?a=10&b=big');
  });
});

describe("UrlMaker", function () {
  it("url should succeed", function () {
    expect(new util2.UrlMaker('/thread').done()).equal('/thread');
  });
  it("query param should succeed", function () {
    expect(new util2.UrlMaker('/thread').add('p', 10).done()).equal('/thread?p=10');
  });
  it("query params should succeed", function () {
    expect(new util2.UrlMaker('/thread').add('p', 10).add('ps', 16).done()).equal('/thread?p=10&ps=16');
  });
  it("default value should succeed", function () {
    expect(new util2.UrlMaker('/thread').add('p', 0, 0).add('ps', 16, 32).done()).equal('/thread?ps=16');
  });
});
