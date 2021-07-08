import * as assert2 from "../base/assert2.mjs";
import * as init from "../base/init.mjs";
import * as config from "../base/config.mjs";

beforeAll(() => {
  config.setPath('config/test.json');
});

describe('config with valid path', () => {
  it('should succeed', done => {
    init.run(function (err) {
      assert2.ifError(err);
      assert2.ne(config.prop.appName, undefined);
      assert2.e(config.prop.xxx, undefined);
      done();
    });
  });
});

