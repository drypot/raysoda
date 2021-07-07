import * as fs from "fs";
import { exec } from "child_process";
import * as assert2 from "../base/assert2.mjs";
import * as error from "../base/error.mjs";
import * as fs2 from "../base/fs2.mjs";
import * as imageb from "../image/image-base.mjs";

const _minWidth = 3840;
const _minHeight = 2160;

const _vers = [
  {width: 5120, height: 2880}, // iMac 27 Retina
  {width: 4096, height: 2304}, // iMac 21 Retina
  //{ width: 3840, height: 2160 }, // 4K TV
  //{ width: 2880, height: 1620 }, // MacBook Retina 15
  {width: 2560, height: 1440}, // iMac 27, MacBook Retina 13
  //{ width: 2048, height: 1152 }, // iPad mini 2
  //{ width: 1920, height: 1080 }, // iMac 21, Full HD TV
  //{ width: 1680, height: 945 }, // MacBook Pro 15
  //{ width: 1440, height: 810 }, // MacBook Air 13
  //{ width: 1366, height: 768 }, // MacBook Air 11
  {width: 1280, height: 720},  // HD TV // 혹시 미래에 작은 섬네일이 필요할지 모르니 만들어 둔다.
  //{ width: 1136, height: 640 },
  //{ width: 1024, height: 576 },
  //{ width: 960 , height: 540 },
  //{ width: 640 , height: 360 }
];

function getDepth(id) {
  return fs2.makeDeepPath(id, 3);
}

export function getDir(id) {
  return imageb.imageDir + '/' + getDepth(id);
}

export function getPath(id, width) {
  return imageb.imageDir + '/' + getDepth(id) + '/' + id + '-' + width + '.jpg';
}

export function getUrlDir(id) {
  return imageb.imageUrl + '/' + getDepth(id);
}

export function getThumbUrl(id) {
  return imageb.imageUrl + '/' + getDepth(id) + '/' + id + '-2560.jpg';
}

export function checkImageMeta(path, done) {
  exec('mogrify -auto-orient ' + path, function (err) {
    if (err) return done(err);
    imageb.identify(path, function (err, meta) {
      if (err) {
        return done(error.newError('IMAGE_TYPE'));
      }
      if (meta.width < _minWidth - 15 || meta.height < _minHeight - 15) {
        return done(error.newError('IMAGE_SIZE'));
      }
      done(null, meta);
    });
  });
}

export function saveImage(id, src, meta, done) {
  fs2.makeDir(getDir(id), function (err) {
    if (err) return done(err);
    let cmd = 'convert ' + src;
    cmd += ' -quality 92';
    cmd += ' -gravity center';

    let i = 0;
    const vers = [];
    for (; i < _vers.length; i++) {
      if (_vers[i].width < meta.width + (_vers[i].width - _vers[i + 1].width) / 2) {
        break;
      }
    }
    for (; i < _vers.length; i++) {
      const ver = _vers[i];
      vers.push(ver.width);
      cmd += ' -resize ' + ver.width + 'x' + ver.height + '^' // '^' means these are minimum values.
      cmd += ' -crop ' + ver.width + 'x' + ver.height + '+0+0'
      cmd += ' +repage'
      if (i === _vers.length - 1) {
        cmd += ' ' + getPath(id, ver.width);
      } else {
        cmd += ' -write ' + getPath(id, ver.width);
      }
    }
    exec(cmd, function (err) {
      done(err, vers);
    });
  });
}

export function deleteImage(id, done) {
  fs2.removeDir(getDir(id), done);
}
