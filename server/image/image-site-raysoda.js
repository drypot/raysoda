var exec = require('child_process').exec;

var error = require('../base/error');
var config = require('../base/config');
var imageb = require('../image/image-base');

var maxWidth = 1080;

exports.thumbnailSuffix = '.jpg';

exports.checkImageMeta = function (upload, done) {
  imageb.identify(upload.path, function (err, meta) {
    if (err) {
      return done(error('IMAGE_TYPE'));
    }
    if (meta.width * meta.height <= 360 * 240) {
      return done(error('IMAGE_SIZE'));
    }
    done(null, meta);
  });
};

exports.makeVersions = function (upload, save, meta, done) {
  var cmd = 'convert ' + upload.path;
  cmd += ' -quality 92';
  cmd += ' -resize ' + maxWidth + 'x' + maxWidth + '\\>';
  cmd += ' ' + save.path;
  exec(cmd, function (err) {
    done(err, null);
  });
};

exports.fillFields = function (image, form, meta, vers) {
  if (form) {
    image.comment = form.comment;
  }
};
