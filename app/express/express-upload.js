'use strict';

const fs = require('fs');
const path = require('path');
const init = require('../base/init');
const config = require('../base/config');
const fs2 = require('../base/fs2');
const multiparty = require('multiparty');
const expb = require('../express/express-base');
const expu = exports;

var tmpDir;

init.add(
  (done) => {
    console.log('upload: ' + config.uploadDir);
    tmpDir = config.uploadDir + '/tmp';
    fs2.makeDir(tmpDir, function (err) {
      if (err) return done(err);
      fs2.emptyDir(tmpDir, done);
    });
  }
);

// req.files is undefined or
//
// {
//   f1: [ {   <-- input field name
//     fieldName: 'f1',
//     originalFilename: 'express-upload-f1.txt',
//     path: 'upload/rapixel-test/tmp/L-QT_2veCOSuKmOjdsFu3ivR.txt',
//     'content-disposition': 'form-data; name="f1"; filename="upload-f1.txt"',
//     'content-type': 'text/plain'
//     size: 6,
//     safeFilename: 'express-upload-f1.txt'
//   }, {
//     ...
//   },
//     ...
//   ]
// }

expu.parse = function (req, res, next) {
  if (req._body) return next();
  var form = new multiparty.Form({ uploadDir: tmpDir });
  form.parse(req, function(err, fields, files) {
    if (err) return next(err);
    var key, val;
    for (key in fields) {
      val = fields[key];
      req.body[key] = val.length == 1 ? val[0] : val;
    }
    for (key in files) {
      files[key].forEach(function (file) {
        if (file.originalFilename.trim()) {
          // XHR 이 빈 파일 필드를 보낸다.
          // 불필요한 req.files[key] 생성을 막기 위해 조건 처리는 가장 안쪽에서.
          if (!req.files) {
            req.files = {};
            req.filesFlat = [];
          }
          if (!req.files[key]) req.files[key] = [];
          file.safeFilename = fs2.safeFilename(path.basename(file.originalFilename));
          req.files[key].push(file);
          req.filesFlat.push(file);
        }
      });
    }
    next();
  });
};

expu.delete = function (req, res) {
  if (!req.filesFlat) return;
  let i = 0;
  function unlink() {
    if (i === req.filesFlat.length) {
      return;
    }
    var path = req.filesFlat[i++].path;
    fs.unlink(path, function (err) {
      setImmediate(unlink);
    });
  }
  unlink();
}

expb.core.get('/test/upload', function (req, res) {
  res.render('express/express-upload');
});

expb.core.all('/api/test/echo-upload', expu.parse, handleEchoUpload, expu.delete);

function handleEchoUpload(req, res, next) {
  var fileNames = [];
  if (req.files) {
    Object.keys(req.files).forEach(field => {
      req.files[field].forEach(file => {
        fileNames.push(file.originalFilename);
      });
    });
  }
  res.json({
    method: req.method,
    rtype: req.header('content-type'),
    query: req.query,
    body: req.body,
    files: fileNames
  });
  next();
}

