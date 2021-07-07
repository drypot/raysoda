import * as fs from "fs";
import * as assert2 from "../base/assert2.mjs";
import * as error from "../base/error.mjs";
import * as fs2 from "../base/fs2.mjs";
import * as imageb from "../image/image-base.mjs";

function getDepth(id) {
  return fs2.makeDeepPath((id / 1000) >> 0, 2);
}

export function getDir(id) {
  return imageb.imageDir + '/' + getDepth(id);
}

export function getPath(id) {
  return imageb.imageDir + '/' + getDepth(id) + '/' + id + '.svg';
}

export function getUrlDir(id) {
  return imageb.imageUrl + '/' + getDepth(id);
}

export function getThumbUrl(id) {
  return imageb.imageUrl + '/' + getDepth(id) + '/' + id + '.svg';
}

export function checkImageMeta(path, done) {
  imageb.identify(path, function (err, meta) {
    if (err) {
      return done(error.newError('IMAGE_TYPE'));
    }
    if (meta.format !== 'svg') {
      return done(error.newError('IMAGE_TYPE'));
    }
    done(null, meta);
  });
}

export function saveImage(id, src, meta, done) {
  fs2.makeDir(getDir(id), function (err) {
    if (err) return done(err);
    fs2.copy(src, getPath(id), function (err) {
      done(err, null);
    });
  });
}

export function deleteImage(id, done) {
  fs.unlink(getPath(id), function (err) {
    // 파일 없을 경우 나는 에러를 무시한다.
    done();
  });
}
