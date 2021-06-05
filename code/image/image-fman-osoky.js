import * as fs from "fs";
import { exec } from "child_process";
import * as assert2 from "../base/assert2.js";
import * as error from "../base/error.js";
import * as fs2 from "../base/fs2.js";
import * as imageb from "../image/image-base.js";

export const maxWidth = 2048;

function getDepth(id) {
  return fs2.makeDeepPath((id / 1000) >> 0, 2);
};

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
    if (meta.shorter < 640) {
      return done(error.newError('IMAGE_SIZE'));
    }
    done(null, meta);
  });
}

export function saveImage(id, src, meta, done) {
  fs2.makeDir(getDir(id), function (err) {
    if (err) return done(err);
    const shorter = meta.shorter;
    const max = shorter < maxWidth ? shorter : maxWidth;
    const r = (max - 1) / 2;
    let cmd = 'convert ' + src;
    cmd += ' -quality 92';
    cmd += ' -gravity center';
    cmd += ' -auto-orient';
    cmd += ' -crop ' + shorter + 'x' + shorter + '+0+0';
    cmd += ' +repage'; // gif 등에 버추얼 캔버스 개념이 있는데 jpeg 으로 출력하더라고 메타 데이터 소거를 위해 crop 후 repage 하는 것이 좋다.
    cmd += ' -resize ' + max + 'x' + max + '\\>';
    cmd += ' \\( -size ' + max + 'x' + max + ' xc:black -fill white -draw "circle ' + r + ',' + r + ' ' + r + ',0" \\)'
    cmd += ' -alpha off -compose CopyOpacity -composite'
    //cmd += ' \\( +clone -alpha opaque -fill white -colorize 100% \\)'
    //cmd += ' +swap -geometry +0+0 -compose Over -composite -alpha off'
    cmd += ' -background white -alpha remove -alpha off'; // alpha remove need IM 6.7.5 or above
    cmd += ' ' +
    getPath(id);
    exec(cmd, function (err) {
      done(err, null);
    });
  });
}

export let deleteImage = function (id, done) {
  fs.unlink(getPath(id), function (err) {
    // 파일 없을 경우 나는 에러를 무시한다.
    done();
  });
};
