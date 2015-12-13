'use strict';

var fs = require('fs');
var chai = require('chai');
var assert2 = exports;

chai.use(require('chai-http'));
chai.config.includeStack = true;

assert2.expect = chai.expect;
assert2.chai = chai;

assert2.chai.use(function (chai, utils) {
  var Assertion = chai.Assertion;
  Assertion.addProperty('pathExist', function () {
    new Assertion(this._obj).a('string');
    var exist;
    try {
      fs.accessSync(this._obj);
      exist = true;
    } catch (e) {
      exist = false;
    }
    this.assert(
      exist,
      "expected #{this} to exist",
      "expected #{this} not to exist"
    );
  });
});