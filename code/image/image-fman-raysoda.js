import * as fs from "fs";
import { exec } from "child_process";
import * as assert2 from "../base/assert2.js";
import * as error from "../base/error.js";
import * as fs2 from "../base/fs2.js";
import * as imageb from "../image/image-base.js";

export const maxWidth = 2048;

function getDepth(id) {
  return fs2.makeDeepPath((id / 1000) >> 0, 2);
}

export function getDir(id) {
  return imageb.imageDir + '/' + getDepth(id);
}

export function getPath(id) {
  return imageb.imageDir + '/' + getDepth(id) + '/' + id + '.jpg';
}

export function getUrlDir(id) {
  return imageb.imageUrl + '/' + getDepth(id);
}

export function getThumbUrl(id) {
  return imageb.imageUrl + '/' + getDepth(id) + '/' + id + '.jpg';
}

export function checkImageMeta(path, done) {
  imageb.identify(path, function (err, meta) {
    if (err) {
      return done(error.newError('IMAGE_TYPE'));
    }
    if (meta.width * meta.height <= 360 * 240) {
      return done(error.newError('IMAGE_SIZE'));
    }
    done(null, meta);
  });
}

export function saveImage(id, src, meta, done) {
  fs2.makeDir(getDir(id), function (err) {
    if (err) return done(err);
    let cmd = 'convert ' + src;
    cmd += ' -quality 92';
    cmd += ' -auto-orient';
    cmd += ' -resize ' + maxWidth + 'x' + maxWidth + '\\>';
    cmd += ' ' + getPath(id);
    exec(cmd, function (err) {
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
