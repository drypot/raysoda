var expect = require('../base/assert2').expect;

describe('pathExist', function () {
  it('should succeed', function (done) {
    expect('server/base/assert2.js').pathExist;
    expect('server/base/assertX.js').not.pathExist;
    done();
  });
});