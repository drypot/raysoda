'use strict';

const superagent = require('superagent');

const config = require('../base/config');
const assert = require('assert');
const assert2 = require('../base/assert2');
const expl = exports;

// user-fixture 와 같이 여러 테스트 모듈이 세션을 공유할 필요가 있다.
// 각 모듈별로 supertest 류의 라이브러리를 각자 생성해서 사용하면 세션 공유에 문제가 발생한다.
// 세션을 별도 공용 모듈에서 유지해야한다.

// superagent

assert.strictEqual(superagent.Request.prototype.fields, undefined);

superagent.Request.prototype.fields = function(obj){
  for (var key in obj) {
    var val = obj[key];
    if (Array.isArray(val)) {
      for (var i = 0; i < val.length; i++) {
        this.field(key, val[i]);
      }
      continue;
    }
    this.field(key, val);
  }
  return this;
};

// expl

var request;

(expl.newAgent = function () {
  request = superagent.agent();
})();

['post', 'get', 'put', 'del'].forEach(function (method) {
  expl[method] = function () {
    arguments[0] = 'http://localhost:' + config.appPort + arguments[0];
    return request[method].apply(request, arguments);
  }
});
