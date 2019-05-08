'use strict';

const exec = require('child_process').exec;
const fs = require('fs');

const error = require('../base/error');
const fs2 = require('../base/fs2');
const config = require('../base/config');
const imageb = require('../image/image-base');

function getDepth(id) {
  return fs2.makeDeepPath((id / 1000) >> 0, 2);
};

imageb.getDir = function (id) {
  return imageb.imageDir + '/' + getDepth(id);
};

imageb.getPath = function (id) {
  return imageb.imageDir + '/' + getDepth(id) + '/' + id + '.svg';
};

imageb.getDirUrl = function (id) {
  return imageb.imageUrl + '/' + getDepth(id);
};

imageb.getThumbUrl = function (id) {
  return imageb.imageUrl + '/' + getDepth(id) + '/' + id + '.svg';
};

imageb.checkImageMeta = function (path, done) {
  imageb.identify(path, function (err, meta) {
    if (err) {
      return done(error('IMAGE_TYPE'));
    }
    if (meta.format !== 'svg') {
      return done(error('IMAGE_TYPE'));
    }
    done(null, meta);
  });
};

imageb.saveImage = function (id, src, meta, done) {
  fs2.makeDir(imageb.getDir(id), function (err) {
    if (err) return done(err);
    fs2.copy(src, imageb.getPath(id), function (err) {
      done(err, null);
    });
  });
};

imageb.fillImageDoc = function (image, form, meta, vers) {
  if (form) {
    image.comment = form.comment;
  }
};

imageb.deleteImage = function (id, done) {
  fs.unlink(imageb.getPath(id), function (err) {
    // 파일 없을 경우 나는 에러를 무시한다.
    done();
  });
};
