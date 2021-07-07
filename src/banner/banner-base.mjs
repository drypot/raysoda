import * as assert2 from "../base/assert2.mjs";
import * as init from "../base/init.mjs";
import * as dbPersist from "../db/db-persist.mjs";

export let banners = [];

export function setBanners(b) {
  banners = b;
}

init.add(function (done) {
  dbPersist.find('banners', function (err, value) {
    if (err) return done(err);
    banners = value || [];
    done();
  });
});
