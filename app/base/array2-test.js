'use strict';

const assert = require('assert');
const array2 = require('./array2');

describe('find', function () {
  it('should succeed', function () {
    var item = array2.find([ 1, 2, 3], function (item) {
      return item === 2;
    });
    assert.strictEqual(item, 2);
  });
  it('should succeed', function () {
    var item = array2.find([ 1, 2, 3], function (item) {
      return item === 4;
    });
    assert.strictEqual(item, null);
  });
});

describe('mergeArray', function () {
  function eq(item1, item2) {
    return item1.name === item2.name;
  }
  it('should succeed', function () {
    var obj1 = [];
    var obj2 = [{ name: 'n1', value: 'v1' }];
    array2.merge(obj1, obj2, eq);
    assert.strictEqual(obj1.length, 1);
    assert.strictEqual(obj1[0].name, 'n1');
    assert.strictEqual(obj1[0].value, 'v1');
  });
  it('should succeed', function () {
    var obj1 = [{ name: 'n1', value: 'v1' }, { name: 'n2', value: 'v2' }];
    var obj2 = [{ name: 'n2', value: 'v2n' }, { name: 'n3', value: 'v3n' }, { name: 'n4', value: 'v4n' }];
    array2.merge(obj1, obj2, eq);
    assert.strictEqual(obj1.length, 4);
    assert.strictEqual(obj1[0].name, 'n1');
    assert.strictEqual(obj1[0].value, 'v1');
    assert.strictEqual(obj1[1].name, 'n2');
    assert.strictEqual(obj1[1].value, 'v2n');
    assert.strictEqual(obj1[2].name, 'n3');
    assert.strictEqual(obj1[2].value, 'v3n');
    assert.strictEqual(obj1[3].name, 'n4');
    assert.strictEqual(obj1[3].value, 'v4n');
  });
});
