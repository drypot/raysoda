import * as assert2 from "../base/assert2.js";
import * as init from "../base/init.js";
import * as dbPersist from "../db/db-persist.js";

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
